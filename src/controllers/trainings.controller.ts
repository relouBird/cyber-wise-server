import { Request, Response } from "express";
import { TrainingClass } from "../models/training.model";
import { FormationType } from "../types/training.type";

// Permet de recuperer tout les domaines precis...
export const getAllTrainings = async (req: Request, res: Response) => {
  const trainings = new TrainingClass();
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
      if (monoData.image && monoData.image != "") {
        let url = await trainings.getUrl(monoData.image as string);
        newData.push({ ...monoData, image: url ?? "" });
      } else {
        newData.push({ ...monoData, image: "" });
      }
    }

    console.log("data-training =>", newData);
    res
      .status(200)
      .json({ message: "Toutes les Formations sont là...", data: newData });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

// Permet de recuperer un domaine en particulier...
export const getTrainings = (req: Request, res: Response) => {};

// Ceci permet de delete un domain bien evidemment...
export const createTrainings = async (req: Request, res: Response) => {
  const trainings = new TrainingClass();
  let isError = false;
  let errorMessage = "";
  // console.log("image-to-build =>", req.image);
  let dataIncome = {
    ...req.body,
    image: JSON.parse(req.body.image),
  } as FormationType;

  console.log("training-to-build =>", dataIncome);

  let ImageName = dataIncome.image
    ? dataIncome.title.split(" ").join("_") +
      "." +
      (dataIncome.image as File).name.split(".")[
        (dataIncome.image as File).name.split(".").length
      ]
    : "";

  let reqBody: FormationType = {
    ...dataIncome,
    image: dataIncome.image && dataIncome.image != "" ? ImageName : "",
  };

  const data = await trainings.create(reqBody, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && dataIncome.image && dataIncome.image != "") {
    console.log("data-training =>", data);

    const img = dataIncome.image as File;
    await trainings.uploadImage(ImageName, img, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });

    // transforme le file qui arrive en url...
    let det = "";
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      det = reader.result as string;
    };

    let newData: FormationType = {
      ...(data as FormationType),
      image: det,
    };

    res
      .status(200)
      .json({ message: "Toutes les Formations sont là...", data: newData });
  } else if (!isError && (!dataIncome.image || dataIncome.image == "")) {
    console.log("data-training =>", data);
    res
      .status(200)
      .json({ message: "Toutes les Formations sont là...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const updateTrainings = (req: Request, res: Response) => {};

// Ceci permet de delete un domain bien evidemment...
export const deleteTrainings = (req: Request, res: Response) => {};

export const deleteManyTrainings = (req: Request, res: Response) => {};
