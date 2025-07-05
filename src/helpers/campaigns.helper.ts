import {
  CampaignDataGetInterface,
  CampaignDataReturnInterface,
} from "../types/campaigns.type"; // adapte ce chemin

export function transformCampaignData(
  data: CampaignDataGetInterface
): CampaignDataReturnInterface {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    startDate: data.startDate,
    endDate: data.endDate,
    targetUsers: data.targetUsers,
    formations: data.formations,
    createdBy: data.createdBy,
    stats: {
      totalUsers: data.targetUsers.length,
      completedUsers: data.completedUsers,
      inProgressUsers: data.inProgressUsers,
      notStartedUsers: data.notStartedUsers,
      completionRate: data.completionRate,
    },
  };
}

export function reverseTransformCampaignData(
  data: CampaignDataReturnInterface
): CampaignDataGetInterface {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    startDate: data.startDate,
    endDate: data.endDate,
    targetUsers: data.targetUsers,
    formations: data.formations,
    createdBy: data.createdBy,
    completedUsers: data.stats.completedUsers,
    inProgressUsers: data.stats.inProgressUsers,
    notStartedUsers: data.stats.notStartedUsers,
    completionRate: data.stats.completionRate,
  };
}
