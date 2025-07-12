import { Request, Response } from "express";
import { CampaignClass } from "../models/campaigns.model";
import {
  CampaignDataReturnInterface,
  CreateCampaignInterface,
} from "../types/campaigns.type";
import { SubscriptionTrainingClass } from "../models/subscription-training.model";
import { SubscriptionTrainingGet } from "../types/sub-training.type";

// ceci permet de recuperer toutes les campagnes recentes...
export const getAllCampaigns = async (req: Request, res: Response) => {};

// ceci permet de recuperer toutes les campagnes recentes d'une organisation...
export const getAllOrgCampaigns = async (req: Request, res: Response) => {
  const campaigns = new CampaignClass();
  let isError = false;
  let errorMessage = "";
  const data = await campaigns.getByOrg(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    console.log("data-campaigns =>", data);
    res.status(200).json({
      message: `Tout les campaigns de l'org ${req.params.id}...`,
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Campagnes",
      error: errorMessage,
    });
  }
};

// ceci permet de recuperer tout les utilisateurs d'une campagne...
export const getAllCampaignsUsers = async (req: Request, res: Response) => {
  // const campaigns = new CampaignClass();
  const subTraining = new SubscriptionTrainingClass();
  let isError = false;
  let errorMessage = "";
  const data = await subTraining.getAllByCampaignId(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    console.log("data-campaigns =>", data);
    res.status(200).json({
      message: `Tout les campaigns de l'org ${req.params.id}...`,
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Campagnes",
      error: errorMessage,
    });
  }
};

/**
 * Ceci permet de creer une campagne recente...
 * ça peut etre un ajout d'utilisateur une suppression ou une mise à jour...
 */
export const createCampaign = async (req: Request, res: Response) => {
  const campaigns = new CampaignClass();
  const subTraining = new SubscriptionTrainingClass();

  let isError = false;
  let errorMessage = "";

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  console.log("data-to-create-campaign =>", req.body);

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName = imageFile
    ? String(Math.round(Math.random() * 1000000))
    : "";

  const reqBody: CreateCampaignInterface = {
    ...req.body,
    targetUsers: JSON.parse(req.body.targetUsers),
    formations: JSON.parse(req.body.formations),
    image: "",
  };

  console.log("data-to-create-campaign =>", reqBody);

  if (imageFile) {
    await campaigns.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
      }
    );

    const data = await campaigns.getUrl(imageName);

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);

    const data = await campaigns.create(reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-creation =>", errorMessage);
    });

    if (data) {
      let dataToCreate: SubscriptionTrainingGet[] = [];
      for (let i = 0; i < data.targetUsers.length; i++) {
        for (let j = 0; j < data.formations.length; j++) {
          dataToCreate.push({
            uid: data.targetUsers[i],
            cid: data.id,
            fid: Number(data.formations[j]),
            progress: 0,
          });
        }
      }

      console.log("data-to-create =>", dataToCreate);
      await subTraining.createMany(dataToCreate, (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-creation-sub =>", errorMessage);
      });
      setTimeout(() => {
        res.status(200).json({
          message: "Campagne créée avec success...",
          data: data,
        });
      }, 1500);
    } else {
      setTimeout(() => {
        res
          .status(404)
          .json({ message: "Erreur upload image", details: errorMessage });
      }, 1500);
    }
  } else {
    res.status(500).send({
      message: "Erreur lors de la récupération des Campagnes",
      error: errorMessage,
    });
  }
};

/**
 * Ceci permet de mettre à jour une campagne recente...
 * ça peut etre un ajout d'une formation, une suppression ou une participation d'un utilisateur...
 */
export const updateCampaign = async (req: Request, res: Response) => {
  const campaigns = new CampaignClass();
  let isError = false;
  let errorMessage = "";

  console.log("formation-to-update =>", req.body);

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  let dataIncome = {
    ...req.body,
    image: req.file,
  } as CampaignDataReturnInterface;

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName =
    typeof imageFile == "object"
      ? String(Math.round(Math.random() * 1000000))
      : "";

  console.log("formation-to-update =>", dataIncome);

  const reqBody: CampaignDataReturnInterface = {
    ...req.body,
  };

  if (imageFile && typeof imageFile == "object") {
    await campaigns.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
      }
    );

    const data = await campaigns.getUrl(imageName);

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);

    const data = await campaigns.update(req.params.id, reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-creation =>", errorMessage);
    });

    if (!isError) {
      setTimeout(() => {
        res.status(200).json({
          message: "Campagne modifiée avec success...",
          data: data,
        });
      }, 1500);
    } else {
      setTimeout(() => {
        res
          .status(500)
          .json({ message: "Erreur upload image", details: errorMessage });
      }, 1500);
    }
  } else {
    setTimeout(() => {
      res.status(500).json({
        message: "Erreur lors de la création",
        details: errorMessage,
      });
    }, 1500);
  }
};

// Ceci permet de delete une formation bien evidemment...
export const deleteCampaign = async (req: Request, res: Response) => {
  const campaigns = new CampaignClass();
  const id = req.params.id;
  let isError = false;
  let errorMessage = "";

  // const coursesData = await courses.deleteAllByTraining(id, (error) => {
  //   isError = true;
  //   errorMessage = error?.message ?? "";
  // });

  if (!isError) {
    const data = await campaigns.deleteCampaign(id, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });
    setTimeout(() => {
      res.status(200).json({
        message: "Campagne d'id " + data?.id + " a été supprimé...",
        data: data,
      });
    }, 1500);
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Domaines",
      error: errorMessage,
    });
  }
};
