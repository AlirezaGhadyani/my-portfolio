import { z } from "zod";

export const ContactPayloadSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
	email: z.email("Please provide a valid email address").max(254, "Email address is too long"),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters")
		.max(2000, "Message cannot exceed 2000 characters"),
	turnstileToken: z.string().optional(),
	honeypot: z.string().optional(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export interface ContactEnv {
	RESEND_API_KEY?: string;
	CONTACT_TO_EMAIL?: string;
	CONTACT_FROM_EMAIL?: string;
	TURNSTILE_SECRET_KEY?: string;
	RATE_LIMIT_KV?: {
		get(key: string): Promise<string | null>;
		put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
	};
}

export interface RateLimiter {
	isRateLimited(ip: string, limit?: number, windowSeconds?: number): Promise<boolean>;
}

const memoryRateLimitMap = new Map<string, number[]>();

export const memoryRateLimiter: RateLimiter = {
	async isRateLimited(ip: string, limit = 3, windowSeconds = 600): Promise<boolean> {
		const now = Date.now();
		const windowMs = windowSeconds * 1000;
		const timestamps = (memoryRateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);

		if (timestamps.length >= limit) {
			return true;
		}

		timestamps.push(now);
		memoryRateLimitMap.set(ip, timestamps);
		return false;
	},
};

export function createKvRateLimiter(kv: ContactEnv["RATE_LIMIT_KV"]): RateLimiter {
	if (!kv) return memoryRateLimiter;

	return {
		async isRateLimited(ip: string, limit = 3, windowSeconds = 600): Promise<boolean> {
			const key = `ratelimit:${ip}`;
			const raw = await kv.get(key);
			const count = raw ? parseInt(raw, 10) : 0;

			if (count >= limit) {
				return true;
			}

			await kv.put(key, String(count + 1), { expirationTtl: windowSeconds });
			return false;
		},
	};
}

export async function verifyTurnstileToken(
	token: string,
	secret: string,
	remoteIp?: string,
): Promise<{ success: boolean; errorCodes?: string[] }> {
	try {
		const formData = new URLSearchParams();
		formData.append("secret", secret);
		formData.append("response", token);
		if (remoteIp) {
			formData.append("remoteip", remoteIp);
		}

		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		if (!response.ok) {
			return { success: false, errorCodes: [`http-${response.status}`] };
		}

		const data = (await response.json()) as {
			success: boolean;
			"error-codes"?: string[];
		};
		return {
			success: Boolean(data.success),
			errorCodes: data["error-codes"],
		};
	} catch (error) {
		return {
			success: false,
			errorCodes: [error instanceof Error ? error.message : "network-error"],
		};
	}
}

export async function sendEmailViaResend(options: {
	apiKey: string;
	from: string;
	to: string;
	replyTo: string;
	subject: string;
	text: string;
	html?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${options.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: options.from,
				to: options.to,
				reply_to: options.replyTo,
				subject: options.subject,
				text: options.text,
				html: options.html,
			}),
		});

		if (!res.ok) {
			const errorBody = await res.text();
			return {
				success: false,
				error: `Resend API error (${res.status}): ${errorBody}`,
			};
		}

		const data = (await res.json()) as { id: string };
		return { success: true, id: data.id };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to send email",
		};
	}
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

export async function handleContactRequest(request: Request, env: ContactEnv = {}): Promise<Response> {
	if (request.method !== "POST") {
		return jsonResponse(
			{
				success: false,
				error: "Method not allowed. Only POST is supported.",
			},
			405,
		);
	}

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return jsonResponse(
			{
				success: false,
				error: "Invalid JSON payload in request body.",
			},
			400,
		);
	}

	const parseResult = ContactPayloadSchema.safeParse(payload);
	if (!parseResult.success) {
		const firstError = parseResult.error.issues[0]?.message || "Invalid form data.";
		return jsonResponse(
			{
				success: false,
				error: firstError,
				errors: parseResult.error.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})),
			},
			400,
		);
	}

	const { name, email, message, honeypot, turnstileToken } = parseResult.data;

	if (honeypot && honeypot.trim().length > 0) {
		return jsonResponse({
			success: true,
			message: "Message received successfully.",
		});
	}

	const rawClientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
	if (!rawClientIp) {
		return jsonResponse(
			{
				success: false,
				error: "Unable to identify client IP.",
			},
			400,
		);
	}
	const clientIp = rawClientIp;

	const rateLimiter = env.RATE_LIMIT_KV ? createKvRateLimiter(env.RATE_LIMIT_KV) : memoryRateLimiter;

	const isLimited = await rateLimiter.isRateLimited(clientIp, 3, 600);
	if (isLimited) {
		return jsonResponse(
			{
				success: false,
				error: "Too many requests. Please wait a few minutes before trying again.",
			},
			429,
		);
	}

	if (!env.TURNSTILE_SECRET_KEY) {
		console.error("[contact] misconfigured: TURNSTILE_SECRET_KEY not set");
		return jsonResponse(
			{
				success: false,
				error: "Contact form is temporarily unavailable. Please email me directly.",
			},
			503,
		);
	}

	if (!turnstileToken) {
		return jsonResponse(
			{
				success: false,
				error: "Bot verification token is missing.",
			},
			400,
		);
	}

	const turnstile = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);

	if (!turnstile.success) {
		return jsonResponse(
			{
				success: false,
				error: "Turnstile challenge verification failed. Please refresh and try again.",
			},
			400,
		);
	}

	const resendApiKey = env.RESEND_API_KEY;
	if (!resendApiKey) {
		console.error("[contact] misconfigured: RESEND_API_KEY not set");
		return jsonResponse(
			{
				success: false,
				error: "Contact form is temporarily unavailable. Please email me directly.",
			},
			503,
		);
	}

	const toEmail = env.CONTACT_TO_EMAIL || "contact@example.com";
	const fromEmail = env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
	// eslint-disable-next-line no-control-regex
	const sanitizedSubjectName = name.replace(/[\r\n\u0000-\u001f]/g, " ");

	const emailResult = await sendEmailViaResend({
		apiKey: resendApiKey,
		from: fromEmail,
		to: toEmail,
		replyTo: email,
		subject: `New Portfolio Message from ${sanitizedSubjectName}`,
		text: `Name: ${name}\nEmail: ${email}\nIP: ${clientIp}\n\nMessage:\n${message}`,
		html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>IP:</strong> ${escapeHtml(clientIp)}</p>
<hr />
<p><strong>Message:</strong></p>
<p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`,
	});

	if (!emailResult.success) {
		return jsonResponse(
			{
				success: false,
				error: "Failed to deliver message. Please try again later or reach out directly.",
			},
			502,
		);
	}

	return jsonResponse({
		success: true,
		message: "Thank you! Your message has been sent successfully.",
	});
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export const onRequestPost: (context: { request: Request; env: ContactEnv }) => Promise<Response> = async (context) => {
	return handleContactRequest(context.request, context.env);
};
