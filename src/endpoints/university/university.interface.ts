import { Document } from "mongoose";

export default interface University extends Document {
    accreditationCertificate: Buffer;
    logo: Buffer;
    libelle: string;
    localisation: string;
    registrationNumber: string;
}