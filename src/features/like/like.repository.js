import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model('like', likeSchema);

export default class LikeRepository{

    async getAllLikes(id, type) {
        try{
            return await LikeModel.find({
                likeable: new ObjectId(id),
                types: type
            }).populate('user').populate({path: 'likeable', model: type});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async likeProduct(userId, productId) {
        try{
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types: 'Product'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async likeCategory(userId, categoryId) {
        try{
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: 'Category'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }
}