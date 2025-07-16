import { Request, Response } from "express";
import { TrainingClass } from "../models/training.model";
import { FormationType } from "../types/training.type";
import { CoursesClass } from "../models/courses.model";
import { SubscriptionTrainingClass } from "../models/subscription-training.model";
import {
  SubscriptionTrainingGet,
  SubscriptionTrainingUser,
} from "../types/sub-training.type";
import { createSubscriptionTrainingFromTraining } from "../helpers/sub-training.helper";
import { SubscriptionCoursesClass } from "../models/subscription-courses.model";
import { SubCoursesInterface } from "../types/sub-courses.type";
import { CampaignClass } from "../models/campaigns.model";

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

  const imageName = imageFile
    ? String(Math.round(Math.random() * 1000000))
    : "";

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

// Partie utilisateurs finaux....
//--------------------------------------

// Permet de recuperer un une formation en particulier...
export const getTrainingsToSuscription = async (
  req: Request,
  res: Response
) => {
  const trainings = new TrainingClass();
  const courses = new CoursesClass();
  const subTrainings = new SubscriptionTrainingClass();

  let isError = false;
  let errorMessage = "";

  const data = await trainings.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  const newData: FormationType[] = [];

  if (data && data.length) {
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
  }

  if (!isError && data) {
    const datas = await subTrainings.getAll((error) => {
      console.log("error =>", error?.message);
      isError = true;
      errorMessage = error?.message ?? "";
    });

    let tabToReturn: SubscriptionTrainingUser[] = [];

    let userSub = datas?.filter((u) => u.uid == req.params.id) || [];

    for (let i = 0; i < newData.length; i++) {
      const formation = newData[i];
      const index = userSub.reverse().findIndex((u) => u.fid == formation.id);

      if (index != -1) {
        let partial = createSubscriptionTrainingFromTraining(
          formation,
          datas?.filter((u) => u.fid == formation.id).length ?? 0,
          userSub[index].progress,
          userSub[index].status ?? "not_started",
          userSub[index].id ?? 1
        );
        console.log("partial =>", partial);
        tabToReturn.push(partial);
      } else {
        let partial = createSubscriptionTrainingFromTraining(
          formation,
          datas?.filter((u) => u.fid == formation.id).length ?? 0,
          0,
          "not_started"
        );
        tabToReturn.push(partial);
      }
    }
    res.status(200).json({
      message: "Toutes les Formations sont là...",
      data: tabToReturn,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      details: errorMessage,
    });
  }
};

// Permet de recuperer un une formation en particulier...
export const getCampaignTrainingsToSuscription = async (
  req: Request,
  res: Response
) => {
  const trainings = new TrainingClass();
  const courses = new CoursesClass();
  const campaigns = new CampaignClass();
  const subTrainings = new SubscriptionTrainingClass();

  let isError = false;
  let errorMessage = "";

  const data = await trainings.getAll((error) => {
    isError = true;
    errorMessage = error?.message ?? "";
    console.log("erreur-recuperation-trainings=>", errorMessage);
  });

  const campaignNow = await campaigns.get(req.params.cid, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
    console.log("erreur-recuperation-campaign=>", errorMessage);
  });

  const newData: FormationType[] = [];

  if (data && data.length) {
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
  }

  if (!isError && data && campaignNow) {
    const datas = await subTrainings.getAll((error) => {
      console.log("error =>", error?.message);
      isError = true;
      errorMessage = error?.message ?? "";
    });

    let tabToReturn: SubscriptionTrainingUser[] = [];

    let userSub =
      datas?.filter(
        (u) => u.uid == req.params.id && u.cid == Number(req.params.cid)
      ) || [];

    for (let i = 0; i < newData.length; i++) {
      const formation = newData[i];
      const index = userSub.reverse().findIndex((u) => u.fid == formation.id);

      if (index != -1) {
        let partial = createSubscriptionTrainingFromTraining(
          formation,
          datas?.filter((u) => u.fid == formation.id).length ?? 0,
          userSub[index].progress,
          userSub[index].status ?? "not_started",
          userSub[index].id ?? 1
        );
        console.log("partial =>", partial);
        tabToReturn.push(partial);
      }
    }

    // maintenant filtrons les données et ne recuperons que ceux appartenant à la campaign

    res.status(200).json({
      message: "Toutes les Formations sont là...",
      data: tabToReturn,
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Users",
      details: errorMessage,
    });
  }
};

// ceci permet de recuperer tout les cours lié a une formation
export const getAllCoursesByFormationId = async (
  req: Request,
  res: Response
) => {
  const subCourses = new SubscriptionCoursesClass();
  let isError = false;
  let errorMessage = "";

  const data = await subCourses.getAllBySubTraining(req.params.id, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
  });

  if (!isError && data) {
    console.log("Recuperation de tout les cours...");
    res.status(200).json({
      message: "Tout les cours sont là...",
      data: data.sort((a, b) => a.order - b.order),
    });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      details: errorMessage,
    });
  }
};

// Ceci permet de recuperer la souscription d'un utilisateur et de faire de la souscription aux cours...
export const subscribeToTrainings = async (req: Request, res: Response) => {
  const subTrainings = new SubscriptionTrainingClass();
  const courses = new CoursesClass();
  const subcourses = new SubscriptionCoursesClass();
  let isError = false;
  let errorMessage = "";

  const reqBody: SubscriptionTrainingUser = {
    ...req.body,
  };

  console.log("data-come =>", reqBody);

  let data: SubscriptionTrainingGet | null = null;

  /*
   Ici le but c'est quoi apres avoir recuperer sa souscription ou apres avoir crée sa souscription...
    nous la recuperons et la conservons...
  */
  if (reqBody.sub) {
    data = (await subTrainings.get(String(reqBody.sub), (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
    })) as SubscriptionTrainingGet;

    subTrainings.update(String(data?.id), { ...data, status: "in_progress" });
  } else {
    data = await subTrainings.create(
      {
        uid: req.params.id,
        fid: reqBody.id ?? 1,
        progress: 0,
      },
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
      }
    );
  }

  let isNotCreated = true;

  if (!isError && data) {
    let partialError = false;
    const subCourse = await subcourses.getAllBySubTraining(
      data.id ?? "",
      (error) => {
        isError = true;
        partialError = true;
        errorMessage = error?.message ?? "";
        console.log("error-get-all-by-sub-training =>", error?.message);
      }
    );
    if (!partialError) {
      // console.log("sub-courses-detected =>", subCourse);
      isNotCreated = subCourse != null && subCourse.length != 0 ? false : true;
    }
  }

  if (!isError && data && isNotCreated) {
    console.log("no-sub-detected");
    // Maintenant nous allons plutot creer des abonnements au cours
    const coursesData = await courses.getAllByFormationId(
      String(reqBody.id),
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
      }
    );

    if (!isError && coursesData) {
      const subCourse = await subcourses.createSubForCourses(
        data.id ?? 1,
        coursesData,
        (error) => {
          isError = true;
          errorMessage = error?.message ?? "";
        }
      );
      setTimeout(() => {
        res.status(200).json({
          message: "Formation souscrite avec success...",
          data: data,
        });
      }, 1500);
    } else {
      setTimeout(() => {
        res.status(500).json({
          message: "Erreur lors de la recuperation des cours ",
          details: errorMessage,
        });
      }, 1500);
    }
  } else if (!isError && data && !isNotCreated) {
    setTimeout(() => {
      res.status(200).json({
        message: "Formation souscrite avec success...",
        data: data,
      });
    }, 1500);
  } else {
    setTimeout(() => {
      res.status(500).json({
        message: "Erreur lors de la souscription",
        details: errorMessage,
      });
    }, 1500);
  }
};

// ceci permet de complete la souscription d'un cours
export const updateSubCoursesByFormationId = async (
  req: Request,
  res: Response
) => {
  const subCourses = new SubscriptionCoursesClass();
  const subTrainings = new SubscriptionTrainingClass();
  let isError = false;
  let errorMessage = "";

  const reqBody: SubCoursesInterface = {
    ...req.body,
    status: "completed",
  };

  console.log("sub-course-to-update-id-" + req.params.cid);

  const data = await subCourses.update(req.params.cid, reqBody, (error) => {
    isError = true;
    errorMessage = error?.message ?? "";
    console.log("error-update-sub-course =>", error?.message);
  });

  const coursesData = await subCourses.getAllBySubTraining(
    req.params.id,
    (error) => {
      isError = true;
      errorMessage = error?.message ?? "";
      console.log("error-get-all-by-sub-training =>", error?.message);
    }
  );

  if (!isError && data && coursesData) {
    let progressData =
      (coursesData.filter((u) => u.status == "completed").length /
        coursesData.length) *
      100;

    console.log(
      "progresss-on-training =>",
      progressData,
      "len-courses =>",
      coursesData.length,
      " courses-completed =>",
      coursesData.filter((u) => u.status == "completed").length
    );

    const data = await subTrainings.update(
      req.params.id,
      {
        progress: Number(progressData.toFixed(2)),
        status: progressData == 100 ? "completed" : "in_progress",
      },
      (error) => {
        isError = true;
        errorMessage = error?.message ?? "";
        console.log("error-update-sub-training =>", error?.message);
      }
    );
    res
      .status(200)
      .json({ message: "Cours complété avec success...", data: data });
  } else {
    res.status(404).send({
      message: "Erreur lors de la récupération des Cours",
      details: errorMessage,
    });
  }
};
