import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";
import { StatsResponse } from "@/types/dashboard";

export async function GET(): Promise<NextResponse<StatsResponse>> {
  try {
    const bigquery = getBigQueryClient();

    // Query for total calls and revenue
    const totalCallsQuery = `
      SELECT 
        COUNT(*) as total_calls,
        COALESCE(SUM(cost), 0) as total_revenue
      FROM \`${DATASET}.calls\`
    `;

    // Query for active agents today
    const activeAgentsQuery = `
      SELECT COUNT(DISTINCT agent_id) as active_agents
      FROM \`${DATASET}.calls\`
      WHERE DATE(start_time) = CURRENT_DATE()
    `;

    // Query for total minutes
    const totalMinutesQuery = `
      SELECT COALESCE(SUM(duration) / 60, 0) as total_minutes
      FROM \`${DATASET}.calls\`
    `;

    // Execute all queries in parallel
    const [totalCallsResults, activeAgentsResults, totalMinutesResults] = await Promise.all([
      bigquery.query({ query: totalCallsQuery }),
      bigquery.query({ query: activeAgentsQuery }),
      bigquery.query({ query: totalMinutesQuery }),
    ]);

    const totalCallsRow = totalCallsResults[0][0] || {};
    const activeAgentsRow = activeAgentsResults[0][0] || {};
    const totalMinutesRow = totalMinutesResults[0][0] || {};

    const totalCalls = Number(totalCallsRow.total_calls || 0);
    const activeAgents = Number(activeAgentsRow.active_agents || 0);
    const totalMinutes = Math.round(Number(totalMinutesRow.total_minutes || 0));
    const revenue = Number(totalCallsRow.total_revenue || 0);

    return NextResponse.json({
      totalCalls,
      activeAgents,
      totalMinutes,
      revenue,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        totalCalls: 0,
        activeAgents: 0,
        totalMinutes: 0,
        revenue: 0,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
