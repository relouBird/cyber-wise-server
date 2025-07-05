import { Request, Response } from "express";
import type { ActivityType } from "../types/activity.type";
import { ActivityClass } from "../models/activity.model";

// ceci permet de recuperer toutes les activités recentes...
export const getAllActivities = async (req: Request, res: Response) => {};

// ceci permet de recuperer toutes les activités recentes d'une organisation...
export const getAllOrgActivities = async (req: Request, res: Response) => {
  const activities = new ActivityClass();
  let isError = false;
  let errorMessage = "";
  const data = await activities.getByOrg(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    console.log("data-activities =>", data);
    res.status(200).json({
      message: `Tout les activités de l'org ${req.params.id}...`,
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      error: errorMessage,
    });
  }
};

/**
 * Ceci permet de creer une activité recente pour un user...
 * ça peut etre un ajout d'utilisateur une suppression ou une mise à jour...
 */
export const createUserActivity = async (req: Request, res: Response) => {
  const activities = new ActivityClass();
  const activity: ActivityType = {
    org_id: req.body.org_id,
    activity_id: req.body.activity_id,
    type: "user",
    title: "",
    active: true,
    message: req.body.message,
  };
  let isError = false;
  let errorMessage = "";

  if (req.body.type == "add") {
    activity.title = "Nouvel utilisateur inscrit";
    activity.message += " a rejoint la plateforme";
  } else if (req.body.type == "update") {
    activity.title = "Un utilisateur mis à jour";
    activity.message += " a été mis à jour";
  } else if (req.body.type == "delete") {
    activity.type = "incident";
    activity.title = "Utilisateur Supprimé";
    activity.message += " a quitté la plateforme";
  }

  console.log("data-to-create-activity =>", activity);

  const data = await activities.create(activity, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    setTimeout(() => {
      res.status(200).json({ message: "Activités...", data: data });
    }, 1500);
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

/**
 * Ceci permet de creer une activité recente pour un user...
 * ça peut etre un ajout d'une formation, une suppression ou une participation d'un utilisateur...
 */
export const createTrainingActivity = async (req: Request, res: Response) => {};
