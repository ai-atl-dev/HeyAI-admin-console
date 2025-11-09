import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      call_id,
      caller_number,
      agent_id,
      status,
      duration,
      start_time,
      end_time,
      call_direction,
      from_number,
      to_number,
      recording_url,
      transcript,
      cost,
      region,
      metadata,
    } = body;

    // Validation
    if (!call_id || !agent_id || !status || !start_time) {
      return NextResponse.json(
        { error: "Missing required fields: call_id, agent_id, status, start_time" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Insert data
    const rows = [{
      call_id,
      caller_number: caller_number || null,
      agent_id,
      status,
      duration: duration || null,
      start_time: new Date(start_time).toISOString(),
      end_time: end_time ? new Date(end_time).toISOString() : null,
      created_at: new Date().toISOString(),
      call_direction: call_direction || null,
      from_number: from_number || null,
      to_number: to_number || null,
      recording_url: recording_url || null,
      transcript: transcript || null,
      cost: cost || null,
      region: region || null,
      metadata: metadata || null,
    }];

    await bigquery.dataset(DATASET).table('calls').insert(rows);

    return NextResponse.json({
      success: true,
      message: "Call record created successfully",
      call_id
    });
  } catch (error) {
    console.error("Error creating call record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create call record"
      },
      { status: 500 }
    );
  }
}
