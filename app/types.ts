export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  documentId?: string;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}
