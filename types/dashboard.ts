// Dashboard API Response Types

export interface StatsResponse {
  totalCalls: number;
  activeAgents: number;
  totalMinutes: number;
  revenue: number;
  error?: string;
}

export interface RecentCall {
  caller_number: string;
  agent_id: string;
  status: string;
  duration: number;
  start_time: string;
}

export interface RecentActivityResponse {
  calls: RecentCall[];
  error?: string;
}

export interface QuickStatsResponse {
  successRate: number;
  avgDuration: number;
  agentUtilization: number;
  error?: string;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
}
