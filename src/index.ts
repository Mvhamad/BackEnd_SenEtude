import dotenv from "dotenv"
import App from "./app"
import UserController from "./endpoints/user/user.controller"
import UniversityController from "./endpoints/university/university.controller"

dotenv.config({})

const app = new App([
     new UserController(),
     new UniversityController()
]).app

const port = process.env.SERVER_PORT || 8181

app.listen(port,() => {
     console.log(`Server started successfully on port ${port}...`);
})