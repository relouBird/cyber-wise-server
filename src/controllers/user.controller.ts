import { UserModel } from "../models/user.model";
import { Request, Response } from "express";
import { UserLoginCredentials } from "../types/user.type";

// fonction qui est appelé lors de la requete et permettant de recuperer tout les users
export const getAllUsers = async (req: Request, res: Response) => {
  const user = new UserModel();
  let response: boolean = false;

  const data = await user.getAll((error) => {
    res.status(500).send({
      message: "Erreur lors de la récupération des Users",
      error: error?.message,
    });
    response = true;
  });

  if (!response) {
    res.status(200).json(data);
  }
};

// fonction qui est appelé lors de la requete et permettant de creer un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  const user = new UserModel();
  const data = req.body as UserLoginCredentials;
  let isError = false;
  let errorMessage = "";

  console.log(`user-to-create =>`, data);

  await user.create(data, (error) => {
    isError = true;
    console.log(
      "user-register-error =>",
      error?.message,
      " on email :",
      data.email
    );
    errorMessage = error?.message ?? "";
  });

  if (!isError) {
    const datas = await user.signIn(data, (error) => {
      console.log(
        "user-signin-error =>",
        error?.message,
        " on email :",
        data.email
      );
      errorMessage = error?.message ?? "";
    });
    setTimeout(async () => {
      res.status(201).json({ message: "user has been created.", data: datas });
    }, 1000);
  } else {
    res.status(500).json({
      message: "Erreur lors de la creation...",
      details: errorMessage,
    });
  }
};

// fonction qui permet de connecter un utilisateurs
export const loginUser = async (req: Request, res: Response) => {
  const user = new UserModel();
  const data = req.body as UserLoginCredentials;
  let isError = false;
  let errorMessage = "";

  const datas = await user.signIn(data, (error) => {
    console.log(
      "user-signin-error =>",
      error?.message,
      "on email :",
      data.email
    );
    errorMessage = error?.message ?? "";
    isError = true;
  });

  if (!isError) {
    setTimeout(async () => {
      console.log("user-signin ==>", data.email);
      res.status(201).json({ message: "user has Connected...", data: datas });
    }, 1000);
  } else {
    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur...",
      details: errorMessage,
    });
  }
};

// fonction qui permet de recuperer un utilisateur en fonction de son acces token
export const getUserByAccessToken = async (req: Request, res: Response) => {
  const user = new UserModel();
  const data = req.body as UserLoginCredentials;
  let isError = false;
  let errorMessage = "";

  const datas = await user.signIn(data, (error) => {
    console.log(
      "user-signin-error =>",
      error?.message,
      "on email :",
      data.email
    );
    errorMessage = error?.message ?? "";
    isError = true;
  });

  if (!isError) {
    setTimeout(async () => {
      // res.status(201).json({ message: "user has Connected...", data: datas });
    }, 1000);
  } else {
    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur...",
      details: errorMessage,
    });
  }
};
