// src\types\storesTypes.ts

// useAuth 
export type Progress = {
  company: string;
  stage: 'company_created' | 'items_added';
}
export type Company = {
  _id: string;
  name: string;
}
export interface User {
  name: string;
  email: string;
  photo: string;
}
export type PlatformType = 'facebook' | 'instagram' | 'google' | 'linkedin' | 'tiktok' | 'youtube';
export interface Platform {
 _id: string;
  companyId: string;
  platform: PlatformType;
  connectedBy: string;
  connectedAt: string;
}
export interface AuthState {
  user: User | null;
  company: Company | null;
  progress: Progress | null;
    platforms: Platform[] | null;

  loading: boolean;
  fetchUser: () => void;
}

// useAssistant  Interfaces
export interface AssistantMessagePayload {
  input?: string;
  stage?: string;
  step?: string;
}

export interface AssistantState {
  messages: string[];
  sendMessage: (payload: AssistantMessagePayload) => void;
}