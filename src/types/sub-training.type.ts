export interface CampaignUser {
  id: number;
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
  currentFormationId?: number;
  completedFormations?: number[];
  incidents?: Incident[];
}

export interface SubscriptionTrainingGet {
  id?: number;
  uid: string;
  fid: number;
  cid?: number;
  status?: "not_started" | "in_progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // Pourcentage de completion
  created_at?: string;
}

export interface SubscriptionTrainingUser {
  id?: number;
  sub?: number;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | string;
  duration: number;
  enrolledCount: number;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  active: boolean;
  image?: string;
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
