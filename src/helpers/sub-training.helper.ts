import {
  SubscriptionTrainingGet,
  CampaignUser,
  SubscriptionTrainingUser,
} from "../types/sub-training.type";
import { FormationType } from "../types/training.type";
import { UserSimpleCredentials } from "../types/user.type"; // adapte si besoin

export function createCampaignUserFromSimple(
  subscription: SubscriptionTrainingGet,
  user: UserSimpleCredentials
): CampaignUser {
  return {
    id: subscription.id ?? 1,
    avatar: "", // Tu peux ajouter un champ avatar dans UserSimpleCredentials si besoin
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    campaignId: String(subscription.cid),
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

export function createSubscriptionTrainingFromTraining(
  training: FormationType,
  count: number,
  progress: number,
  status: "not_started" | "in_progress" | "completed",
  sub?: number
): SubscriptionTrainingUser {
  return {
    id: training.id,
    sub: sub && sub,
    title: training.title,
    description: training.description,
    category: training.categorie,
    level: training.level,
    duration: (training.courses?.length ?? 0) * 5,
    status: status,
    enrolledCount: count,
    progress: progress,
    active: training.active,
    image: training.image as string,
  };
}
