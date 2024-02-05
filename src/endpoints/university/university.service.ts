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
    const existUniversity = await this.university.findOne({
      registrationNumber: registrationNumber,
    });

    if (existUniversity) throw new Error("ALREADY_EXIST");

    const university = await this.university.create({
      libelle,
      localisation,
      registrationNumber,
      accreditationCertificate,
      logo,
    });

    return university._id;
  }

  /**
   * affichage de tous les etablissements
   */
  public async getAllUniversities(): Promise<any> {
    const universities = await this.university.find();
    return universities;
  }

  /**
   * modifier les information d'une université (update)
   */
  public async updateUniversity(
    _id: string,
    libelle: string,
    localisation: string, 
    registrationNumber: string,
    accreditationCertificate: Buffer,
    logo: Buffer
  ): Promise<string> {
    let universityToUpdate = await this.university.findByIdAndUpdate(
      _id,
      {
        libelle,
        localisation,
        registrationNumber,
        accreditationCertificate,
        logo,
      },
      { new: true }
    );
    if (!universityToUpdate) throw new Error("NOT_FOUND");
    return universityToUpdate._id;
  }
  
  /**
   * supprimer un établissement
   */
  public async deleteUniversity(_id: string) : Promise<any> {
    let deletedUniversity = await this.university.findByIdAndDelete(_id)
    if(!deletedUniversity) throw new Error('NOT_FOUND')
    return deletedUniversity
  }

}

export default UniversityService;
