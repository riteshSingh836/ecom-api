import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

// creating model from schema.
const UserModel = mongoose.model('User', userSchema)    //User -> collection name, userSchema -> Schema Object

export default class UserRepository{

    async resetPassword(userID, hashedPassword){
        try{
            let user = await UserModel.findById(userID);
            if(user){
                user.password=hashedPassword;
                user.save();    //if found then update
            }else{
                throw new Error("No such user found");
            }
            
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async signUp(user){
        try{
            // create instance of model.
            const newUser = new UserModel(user);
            await newUser.save();   //if found will update, if not create one.
            return newUser;
        }catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
    }

    // async signIn(email, password){
    //     try{
    //        return await UserModel.findOne({email, password});
    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    async findByEmail(email) {
        try{
        return await UserModel.findOne({email});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
      }
}