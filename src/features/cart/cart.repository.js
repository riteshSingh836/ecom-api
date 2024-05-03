import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class CartItemsRepository{

    constructor() {
        this.collection = "cartItems";
    }

    async add(productID, userID, quantity) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
            await collection.updateOne({productID: new ObjectId(productID), userID: new ObjectId(userID)},
            {$setOnInsert: {_id: id},  //this will only work during insert, not while updating
             $inc: {quantity: quantity}},
            {upsert: true});    //do both job of updating and inserting if not found
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    async get(userID) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({userID: new ObjectId(userID)}).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    async delete(cartItemID, userID) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({_id: new ObjectId(cartItemID),userID: new ObjectId(userID)});
            return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }    

    // this function will update the content & retrieve to thet add function (regarding modifying id as normal,..1,2,3)
    async getNextCounter(db) {
        const resultDocument = await db.collection('counters').findOneAndUpdate({_id: 'cartItemId'},
        {$inc: {value: 1}},
        {returnDocument: 'after'});     //returns updated document if "returnNewDocument: 'true' or returnDocument: 'after'"
        console.log(resultDocument);
        return resultDocument.value;
    }
}