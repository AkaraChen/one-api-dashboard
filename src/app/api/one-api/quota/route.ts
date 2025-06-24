import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable caching for this route

export async function GET(request: NextRequest) {
  // Get the query parameters
  const url = new URL(request.url);
  const baseURL = url.searchParams.get("baseURL");
  const token = url.searchParams.get("token");
  const userId = url.searchParams.get("userId");

  if (!baseURL || !token || !userId) {
    return NextResponse.json(
      { error: "Missing baseURL, token or userId parameter" },
      { status: 400 },
    );
  }

  try {
    // Make the request to get status data
    const statusResponse = await fetch(new URL("/api/status", baseURL), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const statusData = await statusResponse.json();
    const quotaPerUnit = statusData.data.quota_per_unit;

    // Make the request to get user data
    const userResponse = await fetch(new URL("/api/user/self", baseURL), {
      headers: {
        Authorization: `Bearer ${token}`,
        "New-Api-User": userId,
      },
    });
    const userData = await userResponse.json();
    const quota = userData.data.quota;

    // Calculate unit
    const unit = quota / quotaPerUnit;

    // Return the combined response
    return NextResponse.json({
      quotaPerUnit,
      quota,
      unit,
      statusData,
      userData,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch provider quota",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
