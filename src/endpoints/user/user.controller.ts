import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../../middlewares/validation.middleware";
import Controller from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";
import validate from "./user.validation";
import authMiddleware from "../../middlewares/authenticated.middleware";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(validate.register),
      this.create
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.get(`${this.path}`, this.allUsers);
    this.router.put(`${this.path}/editUser/:id`, this.updateUser);
    this.router.delete(`${this.path}/delUser/:id`, this.deleteUser);
  }

  private create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const {
        firstName,
        lastName,
        birthDayDate,
        birthPlace,
        email,
        password,
        phoneNumber,
        address,
      } = request.body;

      const userid = await this.userService.create(
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        birthDayDate,
        birthPlace
      );

      response.status(201).json({
        status: 201,
        payload: userid,
      });
    } catch (error: any) {
      let { message } = error;

      switch (message) {
        case "ALREADY_EXIST":
          response.status(409).json({
            status: 409,
            message: "Un utilisateur avec cette adresse email existe déjà",
          });
          break;
        default:
          response.status(500).json({
            status: 500,
            message:
              "Une erreur est survenue lors de la création de l'utilisateur: error => " +
              message,
          });
          break;
      }
    }
  };

  private login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    console.log("-------------------------------------------");
    try {
      const { email, password } = request.body;

      const token = await this.userService.login(email, password);
      console.log("-------------------------------------------", token);

      response.status(200).json({
        status: 200,
        payload: token.token,
        email: email,
        firstName: token.user.firstName,
        lastName: token.user.lastName,
        message: "Utilisateur connecté avec succès.",
      });
    } catch (error: any) {
      let { message } = error;

      switch (message) {
        case "NOT_FOUND":
          response.status(404).json({
            status: 404,
            message: "Cet adresse email n'existe pas.",
          });
          break;
        case "WRONG_CREDENTIALS":
          response.status(401).json({
            status: 401,
            message: "Email/Mot de passe incorrect !",
          });
          break;

        default:
          response.status(500).json({
            status: 500,
            message:
              "Une erreur est survenue lors de l'authentification ! error: =>" +
              message,
          });
          break;
      }
    }
  };

  private allUsers = async (
    req: Request,
    res: Response
  ): Promise<Response | any> => {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).send(users);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Erreur interne du serveur",
      });
    }
  };

  private updateUser = async (
    req: Request,
    res: Response
  ): Promise<Response | any> => {
    try {
        const userId = req.params.id;
        const {
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          address,
          birthDayDate,
          birthPlace,
        } = req.body;
        if (!userId || isNaN(Number(userId))) throw new Error("ID invalide");
        const updatedUser = await this.userService.updateUser(
          userId,
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          address,
          birthDayDate,
          birthPlace
        );
        res.status(200).json({
            status: 200,
            message : "mise à jour reussi",
            data : updatedUser
        });
        
    } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Erreur interne du serveur",
        });
    }
  };

  private deleteUser= async (req:Request, res:Response) :Promise<Response|any> => {
    try {
        const userId = req.params.id;
        await this.userService.deleteUser(userId);
        res.status(200).json({
            status:200,
            message:"suppression réussie"
        })
    } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Erreur interne du serveur",
        });
    }
  }
}

export default UserController;
