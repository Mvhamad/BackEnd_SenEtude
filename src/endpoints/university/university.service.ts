import UniversityModel from "./university.model";

class UniversityService {
    private university = UniversityModel;

  /**
   * Service de création d'un nouvel établissement
   */
    public async create(
        libelle: string,
        localisation: string,
        registrationNumber: string,
        accreditationCertificate: Buffer,
        logo: Buffer
    ): Promise<string> {
        
        const existUniversity = await this.university.findOne({registrationNumber: registrationNumber});

        if(existUniversity)
            throw new Error("ALREADY_EXIST");

        const university = await this.university.create({
            libelle,
            localisation,
            registrationNumber,
            accreditationCertificate,
            logo
        });

        return university._id;

    }

}

export default UniversityService;