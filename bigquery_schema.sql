-- BigQuery Schema for HeyAI Voice Agent Dashboard
-- Replace 'your-project-id' with your actual GCP project ID

-- ============================================
-- TABLE 1: calls
-- Stores all voice call records
-- ============================================
CREATE TABLE `your-project-id.agent_data.calls` (
  -- Core fields
  call_id STRING NOT NULL OPTIONS(description="Unique identifier for each call"),
  caller_number STRING OPTIONS(description="Phone number of the caller"),
  agent_id STRING NOT NULL OPTIONS(description="ID of the AI agent handling the call"),
  status STRING NOT NULL OPTIONS(description="Call status: completed, failed, in-progress, missed"),
  duration INT64 OPTIONS(description="Call duration in seconds"),
  start_time TIMESTAMP NOT NULL OPTIONS(description="When the call started"),
  end_time TIMESTAMP OPTIONS(description="When the call ended"),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description="Record creation timestamp"),

  -- Additional fields
  call_direction STRING OPTIONS(description="inbound or outbound"),
  from_number STRING OPTIONS(description="Source phone number"),
  to_number STRING OPTIONS(description="Destination phone number"),
  recording_url STRING OPTIONS(description="URL to call recording if available"),
  transcript STRING OPTIONS(description="Call transcript"),
  cost FLOAT64 OPTIONS(description="Cost of the call in USD"),
  region STRING OPTIONS(description="Geographic region"),

  -- Metadata
  metadata JSON OPTIONS(description="Additional metadata as JSON")
)
PARTITION BY DATE(start_time)
OPTIONS(
  description="Stores all voice call records for AI agents",
  require_partition_filter=false
);

-- ============================================
-- TABLE 2: agents
-- Stores AI agent information and configuration
-- ============================================
CREATE TABLE `your-project-id.agent_data.agents` (
  -- Core fields
  agent_id STRING NOT NULL OPTIONS(description="Unique agent identifier"),
  agent_name STRING NOT NULL OPTIONS(description="Display name of the agent"),
  status STRING DEFAULT 'active' OPTIONS(description="active, inactive, or maintenance"),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),

  -- Configuration
  voice_model STRING OPTIONS(description="Which voice model is used"),
  language STRING DEFAULT 'en-US' OPTIONS(description="Language setting"),
  max_concurrent_calls INT64 DEFAULT 1 OPTIONS(description="Max simultaneous calls"),

  -- Performance metrics
  total_calls INT64 DEFAULT 0 OPTIONS(description="Total calls handled"),
  total_minutes FLOAT64 DEFAULT 0.0 OPTIONS(description="Total minutes of calls"),
  average_rating FLOAT64 OPTIONS(description="Average customer rating"),

  -- Metadata
  config JSON OPTIONS(description="Agent configuration as JSON")
)
OPTIONS(
  description="Stores AI agent information and configuration"
);

-- ============================================
-- TABLE 3: live_calls
-- Tracks currently active calls for real-time monitoring
-- ============================================
CREATE TABLE `your-project-id.agent_data.live_calls` (
  -- Core fields
  call_id STRING NOT NULL OPTIONS(description="Reference to calls table"),
  agent_id STRING NOT NULL OPTIONS(description="Which agent is on the call"),
  caller_number STRING OPTIONS(description="Who's calling"),
  status STRING DEFAULT 'active' OPTIONS(description="active, on-hold, transferring"),
  start_time TIMESTAMP NOT NULL OPTIONS(description="When started"),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description="Last update time"),

  -- Real-time data
  current_duration INT64 OPTIONS(description="Current duration in seconds"),
  sentiment_score FLOAT64 OPTIONS(description="Real-time sentiment analysis (-1 to 1)"),
  current_topic STRING OPTIONS(description="What's being discussed"),

  -- Metadata
  metadata JSON OPTIONS(description="Additional metadata")
)
OPTIONS(
  description="Tracks currently active calls for live monitoring"
);

-- ============================================
-- TABLE 4: usage_history (Optional)
-- Daily aggregated usage statistics
-- ============================================
CREATE TABLE `your-project-id.agent_data.usage_history` (
  id STRING NOT NULL OPTIONS(description="Unique record ID"),
  date DATE NOT NULL OPTIONS(description="Date of usage"),
  agent_id STRING OPTIONS(description="Agent ID (null for aggregate)"),

  -- Daily metrics
  total_calls INT64 DEFAULT 0,
  total_minutes FLOAT64 DEFAULT 0.0,
  total_cost FLOAT64 DEFAULT 0.0,
  successful_calls INT64 DEFAULT 0,
  failed_calls INT64 DEFAULT 0,

  -- Aggregated data
  avg_call_duration FLOAT64,
  avg_sentiment FLOAT64,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY date
OPTIONS(
  description="Daily aggregated usage statistics",
  require_partition_filter=false
);

-- ============================================
-- SAMPLE DATA INSERTS (for testing)
-- ============================================

-- Insert a sample agent
INSERT INTO `your-project-id.agent_data.agents` (
  agent_id,
  agent_name,
  status,
  created_at,
  updated_at,
  language,
  max_concurrent_calls,
  total_calls,
  total_minutes
) VALUES (
  'agent_001',
  'Customer Support Agent',
  'active',
  CURRENT_TIMESTAMP(),
  CURRENT_TIMESTAMP(),
  'en-US',
  5,
  0,
  0.0
);

-- Insert sample calls
INSERT INTO `your-project-id.agent_data.calls` (
  call_id,
  caller_number,
  agent_id,
  status,
  duration,
  start_time,
  end_time,
  created_at,
  call_direction,
  from_number,
  to_number
) VALUES
  (
    'call_001',
    '+1234567890',
    'agent_001',
    'completed',
    245,
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 HOUR),
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 HOUR) + INTERVAL 245 SECOND,
    CURRENT_TIMESTAMP(),
    'inbound',
    '+1234567890',
    '+0987654321'
  ),
  (
    'call_002',
    '+1111111111',
    'agent_001',
    'completed',
    180,
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR),
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR) + INTERVAL 180 SECOND,
    CURRENT_TIMESTAMP(),
    'inbound',
    '+1111111111',
    '+0987654321'
  ),
  (
    'call_003',
    '+2222222222',
    'agent_001',
    'completed',
    320,
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE),
    TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE) + INTERVAL 320 SECOND,
    CURRENT_TIMESTAMP(),
    'outbound',
    '+0987654321',
    '+2222222222'
  );

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all calls from today
-- SELECT * FROM `your-project-id.agent_data.calls`
-- WHERE DATE(start_time) = CURRENT_DATE()
-- ORDER BY start_time DESC;

-- Get agent performance stats
-- SELECT
--   agent_id,
--   COUNT(*) as total_calls,
--   SUM(duration) / 60 as total_minutes,
--   AVG(duration) as avg_duration,
--   COUNTIF(status = 'completed') as successful_calls,
--   COUNTIF(status = 'failed') as failed_calls
-- FROM `your-project-id.agent_data.calls`
-- GROUP BY agent_id;

-- Get live call count
-- SELECT COUNT(*) as active_calls
-- FROM `your-project-id.agent_data.live_calls`
-- WHERE status = 'active';
