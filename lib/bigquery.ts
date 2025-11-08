import { BigQuery } from "@google-cloud/bigquery";

let bigqueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
  if (bigqueryClient) {
    return bigqueryClient;
  }

  const projectId = process.env.BIGQUERY_PROJECT_ID;
  const credentials = process.env.BIGQUERY_CREDENTIALS;

  if (!projectId || !credentials) {
    throw new Error(
      "Missing BigQuery configuration. Please set BIGQUERY_PROJECT_ID and BIGQUERY_CREDENTIALS environment variables."
    );
  }

  try {
    const credentialsObject = JSON.parse(credentials);
    bigqueryClient = new BigQuery({
      projectId,
      credentials: credentialsObject,
    });
    return bigqueryClient;
  } catch (error) {
    throw new Error(
      `Failed to initialize BigQuery client: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export const DATASET = process.env.BIGQUERY_DATASET || "agent_data";
