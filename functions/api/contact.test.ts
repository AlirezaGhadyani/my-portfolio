import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactPayloadSchema, handleContactRequest, createKvRateLimiter } from "../../functions/api/contact";

describe("Contact API & Validation", () => {
	describe("ContactPayloadSchema", () => {
		it("validates a correct payload", () => {
			const valid = {
				name: "Jane Doe",
				email: "jane@example.com",
				message: "Hello, I would love to discuss a prospective engineering role.",
			};
			const result = ContactPayloadSchema.safeParse(valid);
			expect(result.success).toBe(true);
		});

		it("rejects short name (<2 chars)", () => {
			const invalid = {
				name: "J",
				email: "jane@example.com",
				message: "Valid message exceeding 10 characters.",
			};
			const result = ContactPayloadSchema.safeParse(invalid);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toContain("at least 2 characters");
			}
		});

		it("rejects invalid email addresses", () => {
			const invalid = {
				name: "Jane Doe",
				email: "not-an-email",
				message: "Valid message exceeding 10 characters.",
			};
			const result = ContactPayloadSchema.safeParse(invalid);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toContain("valid email");
			}
		});

		it("rejects short message (<10 chars)", () => {
			const invalid = {
				name: "Jane Doe",
				email: "jane@example.com",
				message: "Too short",
			};
			const result = ContactPayloadSchema.safeParse(invalid);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toContain("at least 10 characters");
			}
		});

		it("accepts optional honeypot and turnstileToken", () => {
			const payload = {
				name: "Jane Doe",
				email: "jane@example.com",
				message: "Valid message exceeding 10 characters.",
				honeypot: "bot-content",
				turnstileToken: "cf-token-12345",
			};
			const result = ContactPayloadSchema.safeParse(payload);
			expect(result.success).toBe(true);
		});
	});

	describe("handleContactRequest HTTP Handler", () => {
		beforeEach(() => {
			vi.restoreAllMocks();
		});

		it("returns 405 Method Not Allowed for non-POST requests", async () => {
			const req = new Request("http://localhost/api/contact", {
				method: "GET",
			});
			const res = await handleContactRequest(req);
			expect(res.status).toBe(405);
			const body = await res.json();
			expect(body.success).toBe(false);
			expect(body.error).toContain("Method not allowed");
		});

		it("returns 400 for malformed JSON body", async () => {
			const req = new Request("http://localhost/api/contact", {
				method: "POST",
				body: "not-json",
				headers: {
					"Content-Type": "application/json",
					"CF-Connecting-IP": "130.140.179.12",
				},
			});
			const res = await handleContactRequest(req);
			expect(res.status).toBe(400);
			const body = await res.json();
			expect(body.error).toContain("Invalid JSON");
		});

		it("returns 400 for schema validation failure", async () => {
			const req = new Request("http://localhost/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"CF-Connecting-IP": "130.140.179.15",
				},
				body: JSON.stringify({
					name: "A",
					email: "invalid-email",
					message: "hi",
				}),
			});
			const res = await handleContactRequest(req);
			expect(res.status).toBe(400);
			const body = await res.json();
			expect(body.success).toBe(false);
			expect(body.errors).toBeDefined();
		});

		it("silently succeeds for bot submissions filling the honeypot", async () => {
			const req = new Request("http://localhost/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"CF-Connecting-IP": "130.140.179.14",
				},
				body: JSON.stringify({
					name: "Spam Bot",
					email: "bot@spam.com",
					message: "Buy cheap watches now online here!",
					honeypot: "filled-by-bot",
				}),
			});
			const res = await handleContactRequest(req);
			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body.success).toBe(true);
		});

		it("returns 429 after exceeding rate limit", async () => {
			const testIp = "72.36.178.105";
			const send = () =>
				handleContactRequest(
					new Request("http://localhost/api/contact", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"CF-Connecting-IP": testIp,
						},
						body: JSON.stringify({
							name: "Rate Limit Test",
							email: "test@example.com",
							message: "Hello this is a valid rate limit test message.",
						}),
					}),
				);

			// 3 requests allowed
			const r1 = await send();
			expect(r1.status).toBe(200);
			const r2 = await send();
			expect(r2.status).toBe(200);
			const r3 = await send();
			expect(r3.status).toBe(200);

			// 4th request rejected
			const r4 = await send();
			expect(r4.status).toBe(429);
			const body = await r4.json();
			expect(body.error).toContain("Too many requests");
		});

		it("supports Cloudflare KV rate limiting", async () => {
			const mockStorage = new Map<string, string>();
			const mockKv = {
				async get(key: string) {
					return mockStorage.get(key) || null;
				},
				async put(key: string, value: string) {
					mockStorage.set(key, value);
				},
			};

			const kvLimiter = createKvRateLimiter(mockKv);
			expect(await kvLimiter.isRateLimited("137.141.178.12", 2, 60)).toBe(false);
			expect(await kvLimiter.isRateLimited("137.141.178.12", 2, 60)).toBe(false);
			expect(await kvLimiter.isRateLimited("137.141.178.12", 2, 60)).toBe(true);
		});

		it("verifies Turnstile token when TURNSTILE_SECRET_KEY is configured", async () => {
			global.fetch = vi.fn().mockImplementation((url) => {
				if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
					return Promise.resolve({
						ok: true,
						json: async () => ({ success: true }),
					} as Response);
				}
				return Promise.resolve({
					ok: true,
					json: async () => ({ id: "email-123" }),
				} as Response);
			});

			const req = new Request("http://localhost/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"CF-Connecting-IP": "130.140.179.63",
				},
				body: JSON.stringify({
					name: "Turnstile User",
					email: "user@example.com",
					message: "Valid message passing turnstile check.",
					turnstileToken: "valid-token",
				}),
			});

			const res = await handleContactRequest(req, {
				TURNSTILE_SECRET_KEY: "test-secret",
			});
			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body.success).toBe(true);
		});

		it("forwards message to Resend API when RESEND_API_KEY is configured", async () => {
			const fetchMock = vi.fn().mockImplementation((url) => {
				if (url === "https://api.resend.com/emails") {
					return Promise.resolve({
						ok: true,
						json: async () => ({ id: "msg_resend_98765" }),
					} as Response);
				}
				return Promise.resolve({ ok: true } as Response);
			});
			global.fetch = fetchMock;

			const req = new Request("http://localhost/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"CF-Connecting-IP": "130.140.179.49",
				},
				body: JSON.stringify({
					name: "Resend User",
					email: "client@example.com",
					message: "Testing email dispatch via Resend API mock.",
				}),
			});

			const res = await handleContactRequest(req, {
				RESEND_API_KEY: "re_123456789",
				CONTACT_TO_EMAIL: "owner@example.com",
			});

			expect(res.status).toBe(200);
			expect(fetchMock).toHaveBeenCalledWith(
				"https://api.resend.com/emails",
				expect.objectContaining({
					method: "POST",
					headers: {
						Authorization: "Bearer re_123456789",
						"Content-Type": "application/json",
					},
				}),
			);
		});
	});
});
