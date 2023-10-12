import { Schema, model } from "mongoose";
import University from "./university.interface";

const UniversitySchema = new Schema({
    registrationNumber: {
        type: String,
        required: true
    },
    logo: {
        type: Buffer
    },
    libelle: {
        type: String,
        required: true
    },
    localisation: {
        type: String,
        required: true
    },
    accreditationCertificate: { 
        type: Buffer,
    },
}, { timestamps: true })

export default model<University>('University', UniversitySchema );
