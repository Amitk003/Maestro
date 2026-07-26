export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export interface LLMProposal {
  action_type: string;
  target_entity: string;
  proposal: Record<string, unknown>;
  utility_score: number;
}

export interface LLMStaffResult {
  logs: LLMProposal[];
  tasks: {
    title: string;
    description: string;
    urgency: string;
    target_table_id: string;
    target_station_id: string;
  }[];
}
