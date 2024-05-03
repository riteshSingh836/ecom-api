import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserRepository{

    constructor() { //instead of hard coding collection in every function, its better to write collection in constructor.
        this.collection = "users";
    }

    async signUp(newUser) { //keeping function here as non-static, instance of class will be created & will not conflict with one another
        try{
            // 1.Get database
            const db = getDB();
            // 2.Get Collection
            const collection = db.collection(this.collection);
            // 3.insert document
            await collection.insertOne(newUser);
            // return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    async findByEmail(email) {
        try{
            // 1.Get database
            const db = getDB();
            // 2.Get Collection
            const collection = db.collection(this.collection);
            // 3.Find the document
            return await collection.findOne({email});
            // return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    // async resetPassword(userID, newPassword) {
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         let user = await collection.findOne(userID);
    //         if(user){
    //             console.log(user);
    //             console.log(user.password);
    //             user.password = newPassword;
    //             user.save();
    //         }else{
    //             throw new Error("User not found");
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("something went wrong with database", 500);
    //     }
    // }
}