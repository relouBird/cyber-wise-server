export interface CampaignUser {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  campaignId: string;
  userId: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // Pourcentage de completion
  currentFormationId?: string;
  completedFormations?: string[];
  incidents?: Incident[];
}

export interface SubscriptionTrainingGet {
  id?: string;
  uid: string;
  fid: string;
  cid: string;
  status?: "not_started" | "in_progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // Pourcentage de completion
  created_at?: string;
}

export interface Incident {
  id: string;
  campaignId: string;
  userId: string;
  type:
    | "phishing_clicked"
    | "password_weak"
    | "download_malware"
    | "social_engineering";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  notes?: string;
}
