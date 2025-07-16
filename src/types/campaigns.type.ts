export interface CreateCampaignInterface {
  name: string;
  description: string;
  image: File | string | undefined;
  org_id?: string;
  createdBy?: string;
  startDate: Date;
  endDate?: Date;
  targetUsers: string[];
  formations: string[];
}

export interface CampaignDataReturnInterface {
  id: string;
  name: string;
  description: string;
  image: string | File | undefined;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate?: Date;
  targetUsers: string[]; // IDs des utilisateurs ciblés
  formations: string[]; // IDs des formations incluses
  createdBy: string; // ID de l'admin créateur
  stats: {
    totalUsers: number;
    completedUsers: number;
    inProgressUsers: number;
    notStartedUsers: number;
    completionRate: number;
  };
}

export interface CampaignDataGetInterface {
  id: string;
  name: string;
  description: string;
  image: string | File | undefined;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate?: Date;
  targetUsers: string[]; // IDs des utilisateurs ciblés
  formations: string[]; // IDs des formations incluses
  createdBy: string; // ID de l'admin créateur
  completedUsers: number;
  inProgressUsers: number;
  notStartedUsers: number;
  completionRate: number;
}


export interface CampaignDataReturnUserInterface {
  id: string;
  name: string;
  description: string;
  image: string | File | undefined;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate?: Date;
  totalFormations: number; 
  completedFormations: number;
  userProgress: number;
  userStatus: "not_started" | "in_progress" | "completed";
  estimatedTime: number;
}