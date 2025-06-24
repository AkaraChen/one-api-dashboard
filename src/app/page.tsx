"use client";

import dynamic from "next/dynamic";
import { Helmet } from "react-helmet-async";

const DashboardClient = dynamic(() => import("./client"), { ssr: false });

function Dashboard() {
  return (
    <>
      <DashboardClient />
      <Helmet>
        <title>One API Dashboard</title>
        <meta name="description" content="One API Dashboard" />
      </Helmet>
    </>
  );
}

export default Dashboard;
