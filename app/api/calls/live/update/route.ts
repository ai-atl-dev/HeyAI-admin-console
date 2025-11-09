import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      call_id,
      agent_id,
      caller_number,
      status,
      start_time,
      current_duration,
      sentiment_score,
      current_topic,
      metadata,
    } = body;

    if (!call_id || !agent_id || !start_time) {
      return NextResponse.json(
        { error: "call_id, agent_id, and start_time are required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Check if live call record exists
    const [existingRows] = await bigquery.query({
      query: `SELECT call_id FROM \`${DATASET}.live_calls\` WHERE call_id = '${call_id.replace(/'/g, "\\'")}'`,
    });

    const now = new Date().toISOString();

    if (existingRows.length > 0) {
      // Update existing live call
      const updateFields: string[] = [
        `status = '${status || 'active'}',`,
        `last_updated = TIMESTAMP('${now}'),`,
        `current_duration = ${current_duration || 0}`,
      ];

      if (sentiment_score !== undefined && sentiment_score !== null) {
        updateFields.push(`sentiment_score = ${sentiment_score}`);
      }
      if (current_topic) {
        updateFields.push(`current_topic = '${current_topic.replace(/'/g, "\\'")}'`);
      }
      if (metadata) {
        updateFields.push(`metadata = JSON '${JSON.stringify(metadata)}'`);
      }

      const query = `
        UPDATE \`${DATASET}.live_calls\`
        SET ${updateFields.join(', ')}
        WHERE call_id = '${call_id.replace(/'/g, "\\'")}'
      `;

      await bigquery.query({ query });

      return NextResponse.json({
        success: true,
        message: "Live call updated successfully"
      });
    } else {
      // Insert new live call
      const rows = [{
        call_id,
        agent_id,
        caller_number: caller_number || null,
        status: status || 'active',
        start_time: new Date(start_time).toISOString(),
        last_updated: now,
        current_duration: current_duration || 0,
        sentiment_score: sentiment_score || null,
        current_topic: current_topic || null,
        metadata: metadata || null,
      }];
      await bigquery.dataset(DATASET).table('live_calls').insert(rows);

      return NextResponse.json({
        success: true,
        message: "Live call created successfully"
      });
    }
  } catch (error) {
    console.error("Error updating live call:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update live call"
      },
      { status: 500 }
    );
  }
}
