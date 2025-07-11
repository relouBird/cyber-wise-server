import { Request, Response } from "express";
import { TrainingClass } from "../models/training.model";
import { FormationType } from "../types/training.type";
import { CoursesClass } from "../models/courses.model";

// Permet de recuperer toutes les formations precises...
export const getAllTrainings = async (req: Request, res: Response) => {
  const trainings = new TrainingClass();
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";
  const data = await trainings.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    const newData: FormationType[] = [];

    for (let i = 0; i < data.length; i++) {
      let monoData = data[i];

      let coursesList = await courses.getAllByFormationId(
        String(monoData.id),
        (error) => {
          console.log("something-where-wrong-image =>", error?.message);
        }
      );

      newData.push({
        ...monoData,
        courses: coursesList ? coursesList : [],
      });
    }

    console.log("data-training =>", newData);
    res
      .status(200)
      .json({ message: "Toutes les Formations sont là...", data: newData });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      details: errorMessage,
    });
  }
};

// Permet de recuperer un une formation en particulier...
export const getTrainingsToSuscription = (req: Request, res: Response) => {
  const trainings = new TrainingClass();
  let isError = false;
  let errorMessage = "";

  const data = trainings.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    res.status(200).json({
      message: "Toutes les Formations sont là...",
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      details: errorMessage,
    });
  }
};

// Ceci permet de delete une formation bien evidemment...
export const createTrainings = async (req: Request, res: Response) => {
  const trainings = new TrainingClass();
  let isError = false;
  let errorMessage = "";

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName = imageFile ? String(Math.round(Math.random() * 1000000)) : "";

  const reqBody: FormationType = {
    ...req.body,
    image: "",
  };

  console.log("data-receive =>", reqBody);

  if (imageFile) {
    await trainings.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
      }
    );

    const data = await trainings.getUrl(imageName);

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);

    const data = await trainings.create(reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-creation =>", errorMessage);
    });

    if (!isError) {
      setTimeout(() => {
        res.status(200).json({
          message: "Formation créée avec success...",
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
export const updateTrainings = async (req: Request, res: Response) => {
  const trainings = new TrainingClass();
  let isError = false;
  let errorMessage = "";

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  let dataIncome = {
    ...req.body,
    image: req.file,
  } as FormationType;

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName =
    typeof imageFile == "object"
      ? String(Math.round(Math.random() * 1000000))
      : "";

  console.log("formation-to-update =>", dataIncome);

  const reqBody: FormationType = {
    ...req.body,
  };

  if (imageFile && typeof imageFile == "object") {
    await trainings.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
      }
    );

    const data = await trainings.getUrl(imageName);

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);

    const data = await trainings.update(req.params.id, reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-creation =>", errorMessage);
    });

    if (!isError) {
      setTimeout(() => {
        res.status(200).json({
          message: "Formation créée avec success...",
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
export const deleteTrainings = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  const training = new TrainingClass();
  const id = req.params.id;
  let isError = false;
  let errorMessage = "";

  const coursesData = await courses.deleteAllByTraining(id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    const data = await training.deleteTraining(id, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });
    setTimeout(() => {
      res.status(200).json({
        message: "Formation d'id " + data?.id + " a été supprimé...",
        data: data,
        coursesListDeleted: coursesData,
      });
    }, 1500);
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Domaines",
      error: errorMessage,
    });
  }
};

export const deleteManyTrainings = (req: Request, res: Response) => {};
