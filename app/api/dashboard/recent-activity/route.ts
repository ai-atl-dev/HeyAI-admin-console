import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";
import { RecentActivityResponse, RecentCall } from "@/types/dashboard";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();

    const [rows] = await bigquery.query({
      query: `
        SELECT 
          caller_number,
          agent_id,
          status,
          duration,
          start_time
        FROM \`${DATASET}.calls\`
        ORDER BY start_time DESC
        LIMIT 10
      `,
    });

    const calls: RecentCall[] = rows.map((row: any) => ({
      caller_number: row.caller_number || "Unknown",
      agent_id: row.agent_id || "Unknown",
      status: row.status || "Unknown",
      duration: Number(row.duration) || 0,
      start_time: row.start_time?.value || row.start_time || new Date().toISOString(),
    }));

    const response: RecentActivityResponse = {
      calls,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      {
        calls: [],
        error: error instanceof Error ? error.message : "Failed to fetch recent activity",
      } as RecentActivityResponse,
      { status: 500 }
    );
  }
}
