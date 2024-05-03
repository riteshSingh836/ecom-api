import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

export default class ProductRepository {

    constructor() { //instead of hard coding collection in every function, its better to write collection in constructor.
        this.collection = "products";
    }

    async add(productData) {
        try{
            productData.categories = productData.category.split(',').map(e=> e.trim()); //here we need to use map fn on individual array to use trim()
            console.log(productData);
            // Many-to-Many
            // 1. Add the product
            const newProduct = new ProductModel(productData);
            const savedProduct = newProduct.save();

            // 2. Update Category
            await CategoryModel.updateMany({_id: {$in: productData.categories}},
                {$push: {products: new ObjectId(savedProduct._id)}});
                //NOTE: we are using operator of Mongodb, but overall simplification is done by Mongoose
                // here we are pushing the id of productData into the Category collection.

            // const db = getDB();
            // const collection = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;  //not required
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with the Database!!", 500);
        }
    }

    async getAll() {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const allProducts = await collection.find().toArray();  //to Array is required to get all products in array.
            return allProducts;
        }catch(err) {
            console.log(err);
            throw new ApplicationError("something went wrong with the Database!!", 500);
        }
    }

    async get(id) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const productById = await collection.findOne({_id: new ObjectId(id)});   
            //Here, id is coming from postman in the form of String.It is required to be converted to object Id, which comes from mongoDB.
            return productById;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with the Database!!", 500);
        }
    }

    async filter(minPrice, categories) {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if (minPrice) {
                filterExpression.price = {$gte: parseFloat(minPrice)};
            }
            // if (maxPrice) { //this condition will override the above if condition, therefore we need to collect earlier filterExpression.price also.
            //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)};
            // }
            categories = JSON.parse(categories.replace(/'/g, '"'));
            console.log(categories);
            if (categories) {
                // we are checking these using and operator
                // $and/$or -->  filterExpression = {$or: [{category:category}, filterExpression]};
                filterExpression = {$or: [{category: {$in: categories}}, filterExpression]};
                // filterExpression.category = category;
            }
            return await collection.find(filterExpression).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the Database", 500);
        }
    }

    async rate(userID, productID, rating) {
        // using relation bw documents-- product and review
        try{
            // 1. check if the product exists
            const productToUpdate = await ProductModel.findById(productID);
            if (!productToUpdate) {
                throw new Error("Product not found");
            }
            // 2. get the existing review
            const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            if (userReview) {
                userReview.rating = rating;
                await userReview.save();
            }else{
                // 3. create new review
                const newReview = new ReviewModel({product: new ObjectId(productID), user: new ObjectId(userID), rating: rating});
                await newReview.save();
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database, 500");
        }


        // try{
        //     const db = getDB();
        //     const collection = db.collection(this.collection);
        //     // const product = await collection.findOne({_id: new ObjectId(productID)});     //1. Find the product
        //     // // console.log(product);
        //     // const userRating = product?.ratings?.find(r=> r.userID == userID);      //2. Find the rating
        //     // console.log(userRating);
        //     // if(userRating){
        //     //     await collection.updateOne({_id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)}, {$set: {"ratings.$.rating": rating}});
        //     // }else{

        //     // 1.remove existing entry
        //     await collection.updateOne({_id: new ObjectId(productID)},{$pull:{ratings:{userID: new ObjectId(userID)}}});
        //     // 2.push new entry
        //     await collection.updateOne({_id: new ObjectId(productID)},{$push:{ratings:{userID: new ObjectId(userID), rating}}});
        //     // }
        // }catch(err){
        //     console.log(err);
        //     throw new ApplicationError("Something went wrong with the Database", 500);
        // }
    }

    async averageProductPricePerCategory() {
        try{
            const db = getDB();
            return await db.collection(this.collection).aggregate([{
                // Stage 1: Average price per category
                $group: {_id: "$category", averagePrice: {$avg: "$price"}}
            }]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the Database", 500);
        }
    }

}