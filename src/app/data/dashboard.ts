export const visitorData = [
	{ date: "2024-01-01", desktop: 320, mobile: 180, tablet: 45 },
	{ date: "2024-01-02", desktop: 290, mobile: 210, tablet: 52 },
	{ date: "2024-01-03", desktop: 410, mobile: 240, tablet: 63 },
	{ date: "2024-01-04", desktop: 380, mobile: 190, tablet: 58 },
	{ date: "2024-01-05", desktop: 510, mobile: 310, tablet: 72 },
	{ date: "2024-01-06", desktop: 620, mobile: 420, tablet: 85 },
	{ date: "2024-01-07", desktop: 580, mobile: 380, tablet: 78 },
	{ date: "2024-01-08", desktop: 420, mobile: 260, tablet: 65 },
	{ date: "2024-01-09", desktop: 390, mobile: 230, tablet: 60 },
	{ date: "2024-01-10", desktop: 470, mobile: 290, tablet: 68 },
	{ date: "2024-01-11", desktop: 530, mobile: 350, tablet: 75 },
	{ date: "2024-01-12", desktop: 610, mobile: 410, tablet: 82 },
	{ date: "2024-01-13", desktop: 720, mobile: 480, tablet: 95 },
	{ date: "2024-01-14", desktop: 680, mobile: 450, tablet: 88 },
	{ date: "2024-01-15", desktop: 550, mobile: 370, tablet: 80 },
];

export const salesData = [
	{ month: "Jan", revenue: 12500, profit: 8500, expenses: 4000 },
	{ month: "Feb", revenue: 14300, profit: 9700, expenses: 4600 },
	{ month: "Mar", revenue: 18200, profit: 12400, expenses: 5800 },
	{ month: "Apr", revenue: 15800, profit: 10500, expenses: 5300 },
	{ month: "May", revenue: 19600, profit: 13200, expenses: 6400 },
	{ month: "Jun", revenue: 22400, profit: 15400, expenses: 7000 },
	{ month: "Jul", revenue: 23800, profit: 16200, expenses: 7600 },
	{ month: "Aug", revenue: 21500, profit: 14500, expenses: 7000 },
	{ month: "Sep", revenue: 18700, profit: 12500, expenses: 6200 },
	{ month: "Oct", revenue: 20300, profit: 13800, expenses: 6500 },
	{ month: "Nov", revenue: 25400, profit: 17800, expenses: 7600 },
	{ month: "Dec", revenue: 31200, profit: 22400, expenses: 8800 },
];

export const marketShareData = [
	{ name: "Electronics", value: 35 },
	{ name: "Clothing", value: 25 },
	{ name: "Home Goods", value: 20 },
	{ name: "Beauty", value: 12 },
	{ name: "Other", value: 8 },
];

// utils/generateMockData.ts
export interface Order {
	id: string;
	customer: string;
	date: string;
	amount: number;
	status: "completed" | "pending" | "failed";
	items: number;
	paymentMethod: string;
}

export function generateMockOrders(count: number): Order[] {
	const statuses: Array<"completed" | "pending" | "failed"> = [
		"completed",
		"pending",
		"failed",
	];
	const paymentMethods = [
		"Credit Card",
		"PayPal",
		"Debit Card",
		"Bank Transfer",
	];
	const customers = [
		"John Smith",
		"Sarah Johnson",
		"Michael Brown",
		"Emily Davis",
		"Robert Wilson",
		"Jennifer Lee",
		"David Miller",
		"Jessica Taylor",
	];

	return Array.from({ length: count }, (_, i) => ({
		id: `#ORD-${10000 + i}`,
		customer: customers[Math.floor(Math.random() * customers.length)],
		date: new Date(
			Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
		)
			.toISOString()
			.split("T")[0],
		amount: parseFloat((Math.random() * 500 + 20).toFixed(2)),
		status: statuses[Math.floor(Math.random() * statuses.length)],
		items: Math.floor(Math.random() * 10) + 1,
		paymentMethod:
			paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
	}));
}
