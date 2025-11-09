import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching agents from BigQuery...");
    const bigquery = getBigQueryClient();

    const query = `
      SELECT
        agent_id,
        agent_name,
        status,
        voice_model,
        language,
        max_concurrent_calls,
        total_calls,
        total_minutes,
        average_rating,
        created_at,
        updated_at,
        config
      FROM \`${DATASET}.agents\`
      ORDER BY created_at DESC
    `;

    const [rows] = await bigquery.query({ query });
    console.log(`Found ${rows.length} agents`);

    // Format the response
    const agents = rows.map((row: any) => ({
      id: row.agent_id,
      name: row.agent_name,
      provider: row.voice_model || "Unknown",
      status: row.status || "active",
      createdAt: row.created_at?.value || row.created_at,
      totalCalls: row.total_calls || 0,
      totalMinutes: row.total_minutes || 0,
      config: row.config,
    }));

    return NextResponse.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch agents",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agent_id");

    if (!agentId) {
      return NextResponse.json(
        { error: "agent_id is required" },
        { status: 400 }
      );
    }

    console.log(`Deleting agent: ${agentId}`);
    const bigquery = getBigQueryClient();

    const query = `
      DELETE FROM \`${DATASET}.agents\`
      WHERE agent_id = @agent_id
    `;

    await bigquery.query({
      query,
      params: { agent_id: agentId },
    });

    console.log(`Agent ${agentId} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting agent:", error);

    // Check if it's a streaming buffer error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isStreamingBufferError = errorMessage.includes("streaming buffer");

    return NextResponse.json(
      {
        success: false,
        error: isStreamingBufferError
          ? "Cannot delete recently added agent. Please wait a few minutes and try again."
          : errorMessage,
      },
      { status: 500 }
    );
  }
}
