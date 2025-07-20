// src/app/page.js (or your component file)
"use client"; // Only needed if using Next.js App Router

import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { DashboardCard } from "./_components/dashboard-card";
import NodgeTable, { ColumnConfig } from "@/components/atoms/table";
import { Separator } from "@/components/ui/separator";
import { generateMockOrders, Order } from "../data/dashboard";
import { useState } from "react";

// Column configuration
const columns: ColumnConfig<Order>[] = [
	{
		field: "id",
		headerName: "Order ID",
		sortable: true,
		width: "120px",
	},
	{
		field: "customer",
		headerName: "Customer",
		sortable: true,
		width: "150px",
	},
	{
		field: "date",
		headerName: "Date",
		sortable: true,
		width: "120px",
	},
	{
		field: "amount",
		headerName: "Amount",
		sortable: true,
		width: "100px",
		renderCell: (item) => `$${item.amount.toFixed(2)}`,
	},
	{
		field: "status",
		headerName: "Status",
		sortable: true,
		width: "120px",
		renderCell: (item) => {
			const statusMap = {
				completed: {
					icon: <CheckCircle className="h-4 w-4 text-green-500" />,
					text: "Completed",
				},
				pending: {
					icon: <Clock className="h-4 w-4 text-yellow-500" />,
					text: "Pending",
				},
				failed: {
					icon: <XCircle className="h-4 w-4 text-red-500" />,
					text: "Failed",
				},
			};
			return (
				<div className="flex items-center gap-2">
					{statusMap[item.status].icon}
					<span>{statusMap[item.status].text}</span>
				</div>
			);
		},
	},
	{
		field: "items",
		headerName: "Items",
		sortable: true,
		width: "80px",
	},
	{
		field: "paymentMethod",
		headerName: "Payment Method",
		sortable: true,
		width: "150px",
	},
];

export default function Home() {
	const { t, ready } = useTranslation();
	const allOrders = generateMockOrders(150);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	if (!ready) {
		return <div>Loading translations...</div>;
	}

	return (
		<div className="w-full">
			<div className="w-full grid-cols-4 grid gap-5">
				<DashboardCard
					title="Total Revenue"
					value="$1,250.00"
					description="Total Revenue"
					trend="up"
					trendValue="+12.5%"
					footerText="Trending up this month"
					footerDescription="Visitors for the last 6 months"
				/>
				<DashboardCard
					title="Total Revenue"
					value="$1,250.00"
					description="Total Revenue"
					trend="up"
					trendValue="+12.5%"
					footerText="Trending up this month"
					footerDescription="Visitors for the last 6 months"
				/>
				<DashboardCard
					title="Total Revenue"
					value="$1,250.00"
					description="Total Revenue"
					trend="up"
					trendValue="+12.5%"
					footerText="Trending up this month"
					footerDescription="Visitors for the last 6 months"
				/>
				<DashboardCard
					title="Total Revenue"
					value="$1,250.00"
					description="Total Revenue"
					trend="up"
					trendValue="+12.5%"
					footerText="Trending up this month"
					footerDescription="Visitors for the last 6 months"
				/>
				<Separator className="col-span-4" />
				<div className="col-span-full">
					<NodgeTable
						data={allOrders}
						columns={columns}
						pagination={{
							enabled: true,
							pageSize: 10, // Default page size
							pageSizeOptions: [5, 10, 20, 30, 50, 100], // Custom options
							currentPage,
							onPageChange: setCurrentPage,
							onPageSizeChange: (size) => {
								console.log("Page size changed to:", size);
								// You might want to update your data fetching here for server-side
							},
						}}
						exportOptions={{
							enabled: true,
							fileName: "orders_export",
							exportAllData: true, // This is now correctly placed in exportOptions
						}}
					/>
				</div>
			</div>
		</div>
	);
}
