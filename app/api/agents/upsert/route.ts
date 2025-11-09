import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      agent_id,
      agent_name,
      status,
      voice_model,
      language,
      max_concurrent_calls,
      config,
    } = body;

    if (!agent_id || !agent_name) {
      return NextResponse.json(
        { error: "agent_id and agent_name are required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Check if agent exists
    const [existingRows] = await bigquery.query({
      query: `SELECT agent_id FROM \`${DATASET}.agents\` WHERE agent_id = '${agent_id.replace(/'/g, "\\'")}'`,
    });

    const now = new Date().toISOString();

    if (existingRows.length > 0) {
      // Update existing agent
      const updateFields: string[] = [
        `agent_name = '${agent_name.replace(/'/g, "\\'")}',`,
        `status = '${status || 'active'}',`,
        `updated_at = TIMESTAMP('${now}')`,
      ];

      if (voice_model) {
        updateFields.push(`voice_model = '${voice_model.replace(/'/g, "\\'")}'`);
      }
      if (language) {
        updateFields.push(`language = '${language}'`);
      }
      if (max_concurrent_calls !== undefined) {
        updateFields.push(`max_concurrent_calls = ${max_concurrent_calls}`);
      }
      if (config) {
        updateFields.push(`config = JSON '${JSON.stringify(config)}'`);
      }

      const query = `
        UPDATE \`${DATASET}.agents\`
        SET ${updateFields.join(', ')}
        WHERE agent_id = '${agent_id.replace(/'/g, "\\'")}'
      `;
      await bigquery.query({ query });

      return NextResponse.json({
        success: true,
        message: "Agent updated successfully",
        agent_id
      });
    } else {
      // Insert new agent
      const rows = [{
        agent_id,
        agent_name,
        status: status || 'active',
        created_at: now,
        updated_at: now,
        voice_model: voice_model || null,
        language: language || 'en-US',
        max_concurrent_calls: max_concurrent_calls || 1,
        total_calls: 0,
        total_minutes: 0.0,
        average_rating: null,
        config: config || null,
      }];
      await bigquery.dataset(DATASET).table('agents').insert(rows);

      return NextResponse.json({
        success: true,
        message: "Agent created successfully",
        agent_id
      });
    }
  } catch (error) {
    console.error("Error saving agent:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save agent"
      },
      { status: 500 }
    );
  }
}
