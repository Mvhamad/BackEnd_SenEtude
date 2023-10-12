import UserModel from "./user.model";
import token from "../../utils/jwt/token";

class UserService {
  private user = UserModel;

  /**
   * Service de création d'un nouveau utilisateur
   */
  public async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: string,
    birthDayDate: string,
    birthPlace: string
  ): Promise<string> {
        
      const existUser = await this.user.findOne({ email: email });

      if (existUser) {
        throw new Error("ALREADY_EXIST");
      }

      const user = await this.user.create({
        firstName,
        lastName,
        birthDayDate,
        birthPlace,
        email,
        password,
        phoneNumber,
        address,
      });

      return user._id;
    
  }

  /**
   * Service de connection d'un utilisateur
   */
  public async login(email: string, password: string): Promise<string | Error> {
    const user = await this.user.findOne({ email });

    if (!user) throw new Error("NOT_FOUND");

    if (!(await user.isIdenticalPassword(password)))
      throw new Error("WRONG_CREDENTIALS");

    return token.generateJwtToken(user);
  }
}

export default UserService;
