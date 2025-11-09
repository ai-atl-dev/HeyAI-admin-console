import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

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
      console.error("Validation failed: missing agent_id or agent_name");
      return NextResponse.json(
        { error: "agent_id and agent_name are required" },
        { status: 400 }
      );
    }

    console.log("Initializing BigQuery client...");
    const bigquery = getBigQueryClient();
    console.log("BigQuery client initialized successfully");

    // Check if agent exists
    const [existingRows] = await bigquery.query({
      query: `SELECT agent_id FROM \`${DATASET}.agents\` WHERE agent_id = '${agent_id.replace(/'/g, "\\'")}'`,
    });

    const now = new Date().toISOString();

    if (existingRows.length > 0) {
      // Update existing agent
      console.log("Updating existing agent...");
      const updateFields: string[] = [
        `agent_name = '${agent_name.replace(/'/g, "\\'")}'`,
        `status = '${status || 'active'}'`,
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

      console.log("Update query:", query);
      await bigquery.query({ query });
      console.log("Agent updated successfully");

      return NextResponse.json({
        success: true,
        message: "Agent updated successfully",
        agent_id
      });
    } else {
      // Insert new agent using DML INSERT (allows immediate updates/deletes)
      console.log("Inserting new agent...");

      const configJson = config ? JSON.stringify(config).replace(/'/g, "\\'") : null;

      const insertQuery = `
        INSERT INTO \`${DATASET}.agents\` (
          agent_id,
          agent_name,
          status,
          created_at,
          updated_at,
          voice_model,
          language,
          max_concurrent_calls,
          total_calls,
          total_minutes,
          average_rating,
          config
        ) VALUES (
          '${agent_id.replace(/'/g, "\\'")}',
          '${agent_name.replace(/'/g, "\\'")}',
          '${status || 'active'}',
          TIMESTAMP('${now}'),
          TIMESTAMP('${now}'),
          ${voice_model ? `'${voice_model.replace(/'/g, "\\'")}'` : 'NULL'},
          '${language || 'en-US'}',
          ${max_concurrent_calls || 1},
          0,
          0.0,
          NULL,
          ${configJson ? `JSON '${configJson}'` : 'NULL'}
        )
      `;

      console.log("Insert query:", insertQuery);
      await bigquery.query({ query: insertQuery });
      console.log("Agent inserted successfully");

      return NextResponse.json({
        success: true,
        message: "Agent created successfully",
        agent_id
      });
    }
  } catch (error) {
    console.error("Error saving agent:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    // Check if it's a streaming buffer error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isStreamingBufferError = errorMessage.includes("streaming buffer");

    return NextResponse.json(
      {
        success: false,
        error: isStreamingBufferError
          ? "Cannot update recently added agent. Please wait a few minutes and try again."
          : errorMessage
      },
      { status: 500 }
    );
  }
}
