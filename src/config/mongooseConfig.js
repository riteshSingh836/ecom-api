import mongoose from "mongoose";
import dotenv from 'dotenv';
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();

const url = process.env.DB_URL;

export const connectUsingMongoose = async() =>{
    try{
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Mongodb using mongoose is connected");
        addCategories();
        // or mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(    //if we are not using async/await
        //     {} => {
        //         console.log("Mongodb using mongoose is connected");
        //     }
        // ).catch(err => console.log(err));
    }catch(err){
        console.log(err);
    }
}

// export const getDB = () => {
//     return client.db();
// }

// To have predefined categories on starting of database
async function addCategories() {
    const CategoryModel = mongoose.model('Category', categorySchema);   //this Category collection name will automatically be pluralized
    const category = await CategoryModel.find();
    if (!category || category.length == 0) {
        await CategoryModel.insertMany([{name: 'Books'}, {name: 'Clothing'}, {name: "Electronics"}]);
    }
    console.log("Categories are added");
}