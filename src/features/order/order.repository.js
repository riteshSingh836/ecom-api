import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{

    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userID){
        const client = getClient();
        const session = client.startSession();
        try{
            const db = getDB();
            session.startTransaction();
            
        // 1. Get cartItems & calculate total amount
            const items = await this.getTotalAmount(userID, session);
            // console.log(items);
            const finaltotalAmount = items.reduce((acc,items)=> acc+items.totalAmount,0);
            // console.log(finaltotalAmount);

        // 2. Create an order record
            const newOrder = new OrderModel(new ObjectId(userID), finaltotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, session);

        // 3. Reduce the stock
            for(let item of items){
                await db.collection("products").updateOne({_id: item.productID}, {$inc:{stock: -item.quantity}}, {session});
            }
            // throw new Error("Something is wrong with the PlaceHolder");
        // 4. Clear the cart items
            await db.collection("cartItems").deleteMany({
                userID: new ObjectId(userID)
            }, {session});
            session.commitTransaction();
            session.endSession();
            return;
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getTotalAmount(userID, session){
        const db = getDB();

        const items =  await db.collection("cartItems").aggregate([
            // 1. Get cart items for the user
            {
                $match:{userID: new ObjectId(userID)}
            },
            // 2. Get the products from products collection
            {
                $lookup:{
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"   //as a nested object in cartItems
                }
            },
            // 3. Unwind the productInfo
            {
                $unwind: "$productInfo"
            },
            // 4. Calculate totalAmount for each cartItems
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]  //since quantity is the part of cartItems collection, not the price
                    }
                } 
            }
        ], {session}).toArray();
        return items;
    }

}