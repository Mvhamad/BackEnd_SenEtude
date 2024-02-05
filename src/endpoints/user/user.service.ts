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
  public async login(email: string, password: string): Promise<any | Error> {
    const user = await this.user.findOne({ email });

    if (!user) throw new Error("NOT_FOUND");

    if (!(await user.isIdenticalPassword(password)))
      throw new Error("WRONG_CREDENTIALS");

    return { token: token.generateJwtToken(user), user };
  }

  /**
   * liste des utilisateurs
   */
  public async getAllUsers() {
    const users = await this.user.find();
    return users;
  }

  /**
   * modifier informations utilisateur
   */
  public async updateUser(
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: string,
    birthDayDate: string,
    birthPlace: string,
  ) : Promise<string> {
    let user = await this.user.findByIdAndUpdate(_id, 
      {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        birthDayDate,
        birthPlace,
      },
      {new: true}
    );
    if(!user){
      throw new Error('USER NOT FOUND');
    }
    return user._id;
  }

  /**
   * delete user
   */
  public async deleteUser(_id:string):Promise<string> {
    let user = await this.user.findByIdAndDelete(_id);
    if (!user) {
      throw new Error("USER NOT FOUND");
    }
    return "User DELETED";
  }
}

export default UserService;
