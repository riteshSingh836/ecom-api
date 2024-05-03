import userModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

// const userRepository = new UserRepository();

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req,res,next) {
        try{
            const {name,email,password,type} = req.body;
            const hashedPassword = await bcrypt.hash(password, 12); //12- salt/roms
            const user = new userModel(name,email,hashedPassword,type);   //user object created here
            //we will wait for repository function to finish
            // await this.userRepository.signUp(user);
            await this.userRepository.signUp(user);
            const userCred = {name,email,type}  //should not return password to client(postman). therefore need to do this.
            res.status(201).send(userCred);     //201-resource has been created
        }catch(err) {
            next(err);
            console.log(err);
            res.status(500).send("something went wrong");   //this response will be send to postman(client)
        }
    }
    async signIn(req,res,next) {
        try{
            const {email,password} = req.body;
            const user = await this.userRepository.findByEmail(email);  //find User by Email.
            // console.log(userEmail);
            if (!user) {
                return res.status(400).send("Incorrect Credentials");
            }else{
                const passwordMatched = await bcrypt.compare(password, user.password); //comparing Password.
                if (passwordMatched){
                    // Create Token
                    const token = jwt.sign({userID: user._id, email: user.email},process.env.JWT_SECRET, {expiresIn: '1h'});
                    // Send Token
                    return res.status(200).send(token);
                }else{
                    return res.status(400).send("Incorrect Credentials");
                }
            }
        }catch(err) {
            next(err);
            console.log(err);
            res.status(500).send("something went wrong");
        }
    }

    async resetPassword(req,res,next) {
        const {newPassword} = req.body;
        const userID = req.userID;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        try{
            await this.userRepository.resetPassword(userID, hashedPassword);
            res.status(200).send("Password is reset");
        }catch(err) {
            console.log(err);
            res.status(500).send("something went wrong");
        }
    }
}