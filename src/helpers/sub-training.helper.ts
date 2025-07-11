import {
  SubscriptionTrainingGet,
  CampaignUser,
} from "../types/sub-training.type";
import { UserSimpleCredentials } from "../types/user.type"; // adapte si besoin

export function createCampaignUserFromSimple(
  subscription: SubscriptionTrainingGet,
  user: UserSimpleCredentials
): CampaignUser {
  return {
    id: subscription.id ?? `${subscription.cid}-${subscription.uid}`,
    avatar: "", // Tu peux ajouter un champ avatar dans UserSimpleCredentials si besoin
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    campaignId: subscription.cid,
    userId: subscription.uid,
    status: subscription.status || "not_started",
    startedAt: subscription.startedAt,
    completedAt: subscription.completedAt,
    progress: subscription.progress,
    currentFormationId: subscription.fid,
    completedFormations: [],
    incidents: [],
  };
}
