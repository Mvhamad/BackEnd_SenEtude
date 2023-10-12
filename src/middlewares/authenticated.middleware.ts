import { Request, Response, NextFunction } from "express";
import { validateJwtToken } from "../utils/jwt/token";
import userModel from "../endpoints/user/user.model";
import Token from "../utils/interfaces/token.interface";
import HttpException from "../utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

async function authenticatedMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void>{
    const bearer = request.headers['authorization'];

    if(!bearer || !bearer.startsWith("Bearer "))
        return response.status(401).json({
            status: 401,
            message: "Unauthorized !"
        })

    const accessToken = bearer.split('Bearer')[1].trim();

    try {

        const payload: Token | jwt.JsonWebTokenError = await validateJwtToken(accessToken);

        if(payload instanceof jwt.JsonWebTokenError)
            return response.status(401).json({
                status: 401,
                message: "Unauthorized !"
            })


        const user = await userModel.findById(payload.id)
            .select("-password")
            .exec()
        ;

        if(!user)
            return response.status(401).json({
                status: 401,
                message: "Unauthorized !"
            })
        
        return next();

    } catch (error: any) {
        return next(new HttpException(500, "Error in authenticated middleware ! error => "+ error));
    }

}
export default authenticatedMiddleware