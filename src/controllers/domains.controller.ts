import { Request, Response } from "express";
import { DomainClass } from "../models/domain.model";
import { TrainingClass } from "../models/training.model";
import { DomainType } from "../types/training.type";

// Permet de recuperer tout les domaines precis...
export const getAllDomains = async (req: Request, res: Response) => {
  const domains = new DomainClass();
  let isError = false;
  let errorMessage = "";
  const data = await domains.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    console.log("data-domains =>", data);
    res
      .status(200)
      .json({ message: "Tout les Domains sont là...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

// Permet de recuperer un domaine en particulier...
export const getDomain = async (req: Request, res: Response) => {
  const domains = new DomainClass();
  let isError = false;
  let errorMessage = "";
  const data = await domains.get(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    console.log("data-created-domains =>", data);
    res
      .status(200)
      .json({ message: "Vous venez de recuperer un domain...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const createDomain = async (req: Request, res: Response) => {
  const domains = new DomainClass();
  const receive = req.body as DomainType;
  let isError = false;
  let errorMessage = "";
  console.log("data-domains =>", receive);
  const data = await domains.create(receive, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    setTimeout(() => {
      res
        .status(200)
        .json({ message: "Vous venez de creer un domain...", data: data });
    }, 1500);
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const updateDomain = async (req: Request, res: Response) => {
  const domains = new DomainClass();
  const receive = req.body as DomainType;
  let isError = false;
  let errorMessage = "";
  console.log("data-update-domains =>", receive);
  const data = await domains.update(req.params.id, receive, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    setTimeout(() => {
      res.status(200).json({
        message: "Vous venez de mettre à jour un domain...",
        data: data,
      });
    }, 1500);
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération du Domain...",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const deleteDomain = async (req: Request, res: Response) => {
  const domain = new DomainClass();
  const training = new TrainingClass();
  const id = req.params.id;
  let isError = false;
  let errorMessage = "";

  const trainingData = await training.deleteAllTrainingDomain(id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    const data = await domain.delete(id, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });
    res.status(200).json({
      message: "Domain d'id " + data?.id + " a été supprimé...",
      data: data,
      formationListDeleted: trainingData,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Domaines",
      error: errorMessage,
    });
  }
};
