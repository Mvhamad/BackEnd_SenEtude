import { Router, Request, Response } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import authMiddleware from "../../middlewares/authenticated.middleware";
import UniversityService from "./university.service";

class UniversityController implements Controller{
    public path = "/universities";
    public router = Router();
    private universityService = new UniversityService();

    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            // validationMiddleware(validate.register),
            this.create
        )
    }

    private create = async (request: Request, response: Response): Promise<Response|void> => {
        try {
            const { registrationNumber, libelle, localisation, accreditationCertificate, logo } = request.body;

            const universityid = await this.universityService.create(libelle, localisation, registrationNumber, accreditationCertificate, logo);

            response.status(201).json({
                status: 201,
                payload: universityid
            })

        } catch (error: any) {
            let { message } = error;

            switch (message) {
                case "ALREADY_EXIST":
                    response.status(409).json({
                        status: 409,
                        message: "Un établissement avec ce meme numero d'accreditation existe déjà !"
                })
                break;
                default:
                    response.status(500).json({
                        status: 500,
                        message: "Une erreur est survenue lors de la création de l'université: error => " + message
                    })
                break;
            }
        }
    }
}

export default UniversityController;