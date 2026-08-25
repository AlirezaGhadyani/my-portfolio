export const formatMonthYear = (value: string): string => {
	const [year, month] = value.split("-").map(Number);
	return new Date(year, (month ?? 1) - 1, 1).toLocaleString("en-GB", {
		month: "short",
		year: "numeric",
	});
};
