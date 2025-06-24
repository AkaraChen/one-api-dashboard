"use client";

import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("./client"), { ssr: false });

function Dashboard() {
  return <DashboardClient />;
}

export default Dashboard;
