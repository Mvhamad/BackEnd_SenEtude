import { Router, Request, Response } from "express";
import Controller from "../../utils/interfaces/controller.interface";
// import authMiddleware from "../../middlewares/authenticated.middleware";
// import validationMiddleware from "../../middlewares/validation.middleware";
import UniversityService from "./university.service";
import { request } from "http";

class UniversityController implements Controller {
    public path = "/universities";
    public router = Router();
    private universityService = new UniversityService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/newUni`,
            // validationMiddleware(validator.register),
            this.create
        );
        this.router.get(
            `${this.path}`,
            // validationMiddleware(validator.register),
            this.all
        );
        this.router.put(
            `${this.path}/editUni/:id`,
            // validationMiddleware(validator.register),
            this.updatuni
        );
        this.router.delete(
            `${this.path}/delUni/:id`,
            // validationMiddleware(validator.register),
            this.deletuni
        );
    }

    private create = async (request: Request,response: Response): Promise<Response | void> => {
        try {
            const {
                registrationNumber,
                libelle,
                localisation,
                accreditationCertificate,
                logo,
            } = request.body;

            const universityid = await this.universityService.create(
                libelle,
                localisation,
                registrationNumber,
                accreditationCertificate,
                logo
            );

            response.status(201).json({
                status: 201,
                payload: universityid,
            });
        } catch (error: any) {
            let { message } = error;

            switch (message) {
                case "ALREADY_EXIST":
                    response.status(409).json({
                        status: 409,
                        message:
                            "Un établissement avec ce meme numero d'accreditation existe déjà !",
                    });
                    break;
                default:
                    response.status(500).json({
                        status: 500,
                        message:
                            "Une erreur est survenue lors de la création de l'université: error => " +
                            message,
                    });
                    break;
            }
        }
    };

    private all = async (request: Request,response: Response): Promise<Response | any> => {
        try {
            const universities = await this.universityService.getAllUniversities();
            if (!universities) {
                throw new Error("NOT_FOUND");
            }

            response.status(200).json({
                status: 200,
                data: universities,
            });
        } catch (error) {
            response.status(500).json({
                status: 500,
                message: "Erreur interne au serveur",
            });
        }
    };

    private updatuni = async (req: Request,res: Response): Promise<Response | any> => {
        console.log("starting update")
        try {
            const id = req.params.id;
            const {
              registrationNumber,
              libelle,
              localisation,
              accreditationCertificate,
              logo,
            } = req.body;
            const updatedUni = await this.universityService.updateUniversity(
              id,
              registrationNumber,
              libelle,
              localisation,
              accreditationCertificate,
              logo
            );
            if (!updatedUni) {
                throw new Error("UNIVERSITY_UPDATE_FAIL");
            }
            return res.status(201).send({
                status: 201,
                message: "Mise à jour effectuée",
                data: updatedUni,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Erreur interne au serveur",
            });
        }
    };

    private deletuni = async (
        req: Request,
        res: Response
    ): Promise<Response | any> => {
        try {
            const id = req.params.id;
            const deletedUni = await this.universityService.deleteUniversity(id);
            if (!deletedUni) {
                throw new Error("UNIVERSITY_DELETE_ERROR");
            }
            return res.status(200).json({
                status: 200,
                message: "Suppression réussie",
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Erreur interne au serveur",
            });
        }
    };
}

export default UniversityController;
