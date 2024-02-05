import { Schema, model } from "mongoose";
import University from "./university.interface";
import { string } from "joi";

const UniversitySchema = new Schema({
    registrationNumber: {
        type: String,
        required: true
    },
    logo: {
        type: String
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
