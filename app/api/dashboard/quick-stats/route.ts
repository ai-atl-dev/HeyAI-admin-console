import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";
import { QuickStatsResponse } from "@/types/dashboard";

export async function GET(): Promise<NextResponse<QuickStatsResponse>> {
  try {
    const bigquery = getBigQueryClient();

    // Query for success rate today
    const successRateQuery = `
      SELECT 
        ROUND(
          COUNTIF(status = 'completed') / COUNT(*) * 100, 
          2
        ) as success_rate
      FROM \`${DATASET}.calls\`
      WHERE DATE(start_time) = CURRENT_DATE()
    `;

    // Query for average duration today (in minutes)
    const avgDurationQuery = `
      SELECT 
        ROUND(AVG(duration) / 60, 2) as avg_duration
      FROM \`${DATASET}.calls\`
      WHERE DATE(start_time) = CURRENT_DATE()
    `;

    // Query for agent utilization today
    // Utilization = total call minutes / (24 * 60 * number of agents)
    const agentUtilizationQuery = `
      SELECT 
        ROUND(
          SUM(duration) / 60 / (24 * COUNT(DISTINCT agent_id)) * 100,
          2
        ) as agent_utilization
      FROM \`${DATASET}.calls\`
      WHERE DATE(start_time) = CURRENT_DATE()
    `;

    // Execute all queries in parallel
    const [successRateResults, avgDurationResults, agentUtilizationResults] = await Promise.all([
      bigquery.query({ query: successRateQuery }),
      bigquery.query({ query: avgDurationQuery }),
      bigquery.query({ query: agentUtilizationQuery }),
    ]);

    const successRateRow = successRateResults[0][0] || {};
    const avgDurationRow = avgDurationResults[0][0] || {};
    const agentUtilizationRow = agentUtilizationResults[0][0] || {};

    const successRate = Number(successRateRow.success_rate || 0);
    const avgDuration = Number(avgDurationRow.avg_duration || 0);
    const agentUtilization = Number(agentUtilizationRow.agent_utilization || 0);

    // Ensure values are within valid ranges
    const normalizedSuccessRate = Math.min(Math.max(successRate, 0), 100);
    const normalizedUtilization = Math.min(Math.max(agentUtilization, 0), 100);

    return NextResponse.json({
      successRate: normalizedSuccessRate,
      avgDuration,
      agentUtilization: normalizedUtilization,
    });
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    return NextResponse.json(
      {
        successRate: 0,
        avgDuration: 0,
        agentUtilization: 0,
        error: error instanceof Error ? error.message : "Failed to fetch quick stats",
      },
      { status: 500 }
    );
  }
}
