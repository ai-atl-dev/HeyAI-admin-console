import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";
import { StatsResponse } from "@/types/dashboard";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();

    // Query for total calls
    const [totalCallsRows] = await bigquery.query({
      query: `SELECT COUNT(*) as total FROM \`${DATASET}.calls\``,
    });
    const totalCalls = totalCallsRows[0]?.total || 0;

    // Query for active agents today
    const [activeAgentsRows] = await bigquery.query({
      query: `
        SELECT COUNT(DISTINCT agent_id) as active
        FROM \`${DATASET}.calls\`
        WHERE DATE(start_time) = CURRENT_DATE()
      `,
    });
    const activeAgents = activeAgentsRows[0]?.active || 0;

    // Query for total minutes
    const [totalMinutesRows] = await bigquery.query({
      query: `SELECT SUM(duration) / 60 as minutes FROM \`${DATASET}.calls\``,
    });
    const totalMinutes = Math.round(totalMinutesRows[0]?.minutes || 0);

    const response: StatsResponse = {
      totalCalls: Number(totalCalls),
      activeAgents: Number(activeAgents),
      totalMinutes,
      revenue: 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        totalCalls: 0,
        activeAgents: 0,
        totalMinutes: 0,
        revenue: 0,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      } as StatsResponse,
      { status: 500 }
    );
  }
}
