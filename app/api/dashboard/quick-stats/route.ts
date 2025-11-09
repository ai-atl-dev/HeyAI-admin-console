import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";
import { QuickStatsResponse } from "@/types/dashboard";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();

    // Query for success rate (completed calls today)
    const [successRateRows] = await bigquery.query({
      query: `
        SELECT 
          COUNTIF(status = 'completed') as completed,
          COUNT(*) as total
        FROM \`${DATASET}.calls\`
        WHERE DATE(start_time) = CURRENT_DATE()
      `,
    });

    const completed = Number(successRateRows[0]?.completed || 0);
    const total = Number(successRateRows[0]?.total || 0);
    const successRate = total > 0 ? (completed / total) * 100 : 0;

    // Query for average call duration today (in minutes)
    const [avgDurationRows] = await bigquery.query({
      query: `
        SELECT AVG(duration) / 60 as avg_minutes
        FROM \`${DATASET}.calls\`
        WHERE DATE(start_time) = CURRENT_DATE()
      `,
    });
    const avgDuration = Number(avgDurationRows[0]?.avg_minutes || 0);

    // Query for agent utilization (calls today / total possible minutes in a day)
    const [utilizationRows] = await bigquery.query({
      query: `
        SELECT COUNT(*) as calls_today
        FROM \`${DATASET}.calls\`
        WHERE DATE(start_time) = CURRENT_DATE()
      `,
    });
    const callsToday = Number(utilizationRows[0]?.calls_today || 0);
    const totalMinutesInDay = 24 * 60; // 1440 minutes
    const agentUtilization = (callsToday / totalMinutesInDay) * 100;

    const response: QuickStatsResponse = {
      successRate,
      avgDuration,
      agentUtilization: Math.min(agentUtilization, 100), // Cap at 100%
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    return NextResponse.json(
      {
        successRate: 0,
        avgDuration: 0,
        agentUtilization: 0,
        error: error instanceof Error ? error.message : "Failed to fetch quick stats",
      } as QuickStatsResponse,
      { status: 500 }
    );
  }
}
