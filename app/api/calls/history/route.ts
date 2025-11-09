import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    console.log(`Fetching call history (limit: ${limit}, offset: ${offset})...`);
    const bigquery = getBigQueryClient();

    const query = `
      SELECT
        c.call_id,
        c.caller_number,
        c.agent_id,
        a.agent_name,
        c.duration,
        c.cost,
        c.start_time,
        c.end_time,
        c.status,
        c.call_direction
      FROM \`${DATASET}.calls\` c
      LEFT JOIN \`${DATASET}.agents\` a ON c.agent_id = a.agent_id
      ORDER BY c.start_time DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const [rows] = await bigquery.query({ query });
    console.log(`Found ${rows.length} calls`);

    // Format the response
    const calls = rows.map((row: any) => ({
      id: row.call_id,
      caller: row.caller_number || "Unknown",
      agent: row.agent_name || row.agent_id || "Unknown",
      duration: row.duration || 0,
      cost: row.cost || 0,
      timestamp: row.start_time?.value || row.start_time,
      status: row.status,
      direction: row.call_direction,
    }));

    return NextResponse.json({
      success: true,
      calls,
      total: rows.length,
    });
  } catch (error) {
    console.error("Error fetching call history:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch call history",
      },
      { status: 500 }
    );
  }
}
