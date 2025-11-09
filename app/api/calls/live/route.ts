import { NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function GET() {
  try {
    const bigquery = getBigQueryClient();

    const [rows] = await bigquery.query({
      query: `
        SELECT
          lc.call_id,
          lc.agent_id,
          lc.caller_number,
          lc.status,
          lc.start_time,
          lc.current_duration,
          lc.sentiment_score,
          lc.current_topic,
          lc.metadata,
          a.agent_name
        FROM \`${DATASET}.live_calls\` lc
        LEFT JOIN \`${DATASET}.agents\` a ON lc.agent_id = a.agent_id
        WHERE lc.status = 'active'
        ORDER BY lc.start_time DESC
      `,
    });

    const liveCalls = rows.map((row: any) => ({
      call_id: row.call_id,
      agent_id: row.agent_id,
      agent_name: row.agent_name || 'Unknown Agent',
      caller_number: row.caller_number,
      status: row.status,
      start_time: row.start_time?.value || row.start_time,
      current_duration: Number(row.current_duration) || 0,
      sentiment_score: row.sentiment_score !== null ? Number(row.sentiment_score) : null,
      current_topic: row.current_topic,
      metadata: row.metadata,
    }));

    return NextResponse.json({
      success: true,
      live_calls: liveCalls,
      count: liveCalls.length
    });
  } catch (error) {
    console.error("Error fetching live calls:", error);
    return NextResponse.json(
      {
        success: false,
        live_calls: [],
        count: 0,
        error: error instanceof Error ? error.message : "Failed to fetch live calls"
      },
      { status: 500 }
    );
  }
}
