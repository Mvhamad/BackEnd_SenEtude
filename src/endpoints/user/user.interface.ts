import { Document } from "mongoose";

export default interface User extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    firstLog: boolean;
    status: boolean;
    phoneNumber: string;
    address: string;
    role: string;
    birthDayDate: Date;
    birthPlace: string;
    
    
    isIdenticalPassword(password: string): Promise<Error | boolean>;
}

export enum ERole{
    SUPER_ADMIN = "SAD",
    STUDENT = "STD"
}