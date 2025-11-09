-- SQL script to create BigQuery tables for HeyAI dashboard
-- Run these queries in BigQuery console or using bq command-line tool

-- Create calls table
CREATE TABLE IF NOT EXISTS `heyai-backend.agent_data.calls` (
  call_id STRING NOT NULL,
  caller_number STRING,
  agent_id STRING,
  status STRING,
  duration INT64,
  cost FLOAT64,
  start_time TIMESTAMP,
  end_time TIMESTAMP
)
PARTITION BY DATE(start_time)
OPTIONS(
  description="Voice call records with agent interactions",
  labels=[("env", "production")]
);

-- Create usage_history table
CREATE TABLE IF NOT EXISTS `heyai-backend.agent_data.usage_history` (
  usage_id STRING NOT NULL,
  agent_id STRING,
  timestamp TIMESTAMP,
  call_count INT64,
  total_minutes INT64,
  total_cost FLOAT64
)
PARTITION BY DATE(timestamp)
OPTIONS(
  description="Aggregated usage statistics by agent",
  labels=[("env", "production")]
);

-- Create payments table
CREATE TABLE IF NOT EXISTS `heyai-backend.agent_data.payments` (
  payment_id STRING NOT NULL,
  user_id STRING,
  amount FLOAT64,
  currency STRING,
  status STRING,
  payment_method STRING,
  timestamp TIMESTAMP
)
PARTITION BY DATE(timestamp)
OPTIONS(
  description="Payment transaction records",
  labels=[("env", "production")]
);

-- Verify tables were created
SELECT 
  table_name,
  creation_time,
  row_count
FROM `heyai-backend.agent_data.__TABLES__`
ORDER BY table_name;
