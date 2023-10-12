import mongoose from "mongoose";
import { Sequelize } from "sequelize";

class Database {


  constructor() {}
  

  public async connectToMongoDB(){

    const { MONGO_URI } = process.env;

    mongoose.connect(MONGO_URI as string)
      .then(() => {
        console.log(
          "Connection à la base de donnée MongoDB établie avec succes."
        );
      })
      .catch((error) => {
        console.error(
          "Une erreur est survenue lors de la connection à la base de donnée MongoDB : => " +
            error
        );
      });
  }
}

export default Database;