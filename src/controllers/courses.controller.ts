import { Request, Response } from "express";
import { TrainingClass } from "../models/training.model";
import { CourseType, DomainType } from "../types/training.type";
import { CoursesClass } from "../models/courses.model";

// Permet de recuperer tout les cours precis...
export const getAllCourses = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";
  const data = await courses.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    console.log("data-courses =>", data);
    res.status(200).json({ message: "Tout les cours sont là...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      error: errorMessage,
    });
  }
};

// Permet de recuperer tout les cours precis...
export const getAllCoursesByFormationId = async (
  req: Request,
  res: Response
) => {
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";
  const data = await courses.getAllByFormationId(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    console.log("data-course =>", data);
    res.status(200).json({
      message: `Tout les Cours de la formation ${req.params.id}...`,
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      error: errorMessage,
    });
  }
};

// Permet de recuperer un domaine en particulier...
export const getCourse = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";
  const data = await courses.get(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    console.log("data-get-course =>", data);
    res
      .status(200)
      .json({ message: "Vous venez de recuperer un Cours...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const createCourse = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName = imageFile
    ? imageFile.originalname.replace(/\s+/g, "_")
    : "";

  const reqBody: CourseType = {
    ...req.body,
    image: "",
  };

  console.log("data-to-create-course =>", reqBody);

  const data = await courses.create(reqBody, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (imageFile) {
    await courses.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
      }
    );

    const data = await courses.getUrl(imageName, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-upload-image =>", errorMessage);
    });

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);

    const data = await courses.create(reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });

    if (isError) {
      setTimeout(() => {
        res
          .status(500)
          .json({ message: "Erreur upload image", details: errorMessage });
      }, 1500);
    } else {
      setTimeout(() => {
        res.status(200).json({
          message: "Cours créé avec image",
          data: data,
        });
      }, 1500);
    }
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      details: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const updateCourse = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  let isError = false;
  let errorMessage = "";

  if (req.file) {
    console.log("Fichier reçu :", req.file); // tu devrais voir le fichier complet
    console.log("Taille du buffer :", req.file?.buffer?.length); // > 0
  }

  let dataIncome = {
    ...req.body,
    image: req.file,
  } as CourseType;

  // Données reçues
  const imageFile = req.file; // vient de multer (en mémoire)

  const imageName =
    typeof imageFile == "object"
      ? imageFile.originalname.replace(/\s+/g, "_")
      : "";

  console.log("data-to-update-course =>", dataIncome);

  const reqBody: CourseType = {
    ...req.body,
  };

  if (imageFile && typeof imageFile == "object") {
    await courses.uploadImage(
      imageName,
      imageFile.buffer as unknown as File, // ✅ ici on envoie un Buffer, pas besoin de "File"
      imageFile.mimetype,
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("erreur-upload-image =>", errorMessage);
        console.log(error);
      }
    );

    const data = await courses.getUrl(imageName, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("erreur-upload-image =>", errorMessage);
    });

    reqBody.image = data ?? "";
  }

  if (!isError) {
    console.log("On upload Correctement =>", reqBody.image);
    const data = await courses.update(req.params.id, reqBody, (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    });

    if (isError) {
      setTimeout(() => {
        res
          .status(500)
          .json({ message: "Erreur upload image", details: errorMessage });
      }, 1500);
    } else {
      setTimeout(() => {
        res.status(200).json({
          message: "Formation créée avec image",
          data: data,
        });
      }, 1500);
    }
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      details: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const deleteCourse = async (req: Request, res: Response) => {
  const courses = new CoursesClass();
  const id = req.params.id;
  let isError = false;
  let errorMessage = "";

  const data = await courses.delete(id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    res.status(200).json({
      message: "Cours d'id " + data?.id + " a été supprimé...",
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Domaines",
      error: errorMessage,
    });
  }
};

// Ceci permet de delete un domain bien evidemment...
export const deleteCoursesbyFormationId = async (
  req: Request,
  res: Response
) => {
  const courses = new CoursesClass();
  const id = req.params.id;
  let isError = false;
  let errorMessage = "";

  const data = await courses.deleteAllByTraining(id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    res.status(200).json({
      message:
        "Cours d'id de formation" +
        (data as CourseType[])[0].id +
        " a été supprimé...",
      data: data,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Domaines",
      error: errorMessage,
    });
  }
};
