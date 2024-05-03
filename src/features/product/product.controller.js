import productModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req,res) {
        try{
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }catch(err) {
            console.log(err);
            return res.status(500).send("Something went Wrong");
        }
    }

    async addProduct(req,res) {
        try{
            // console.log(req.body);  //parsing required
            // console.log("This is a post request");
            const {name, desc, price, category, sizes} = req.body;
            const newProduct = new productModel(name,desc,parseFloat(price),req?.file?.filename,category,sizes?.split(',')); //database ke liye
            // NOTE -- here we have to send all constructor components in series, if not then -- desc: 19.99 (in database).
            // NOTE: split function will give array of those sizes
            // const newProduct = {    //Object Creation here only, not required to create using constructor in model
            //     name,
            //     price: parseFloat(price),
            //     sizes: sizes.split(','),
            //     imageUrl: req.file.filename,
            // };
            const createdRecord =  await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord);
        }catch(err) {
            console.log(err);
            return res.status(500).send("Something went Wrong");
        }
    }

    async getOneProduct(req,res) {
        try{
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if (!product) {
                res.status(404).send("product not found!!");
            }else{
                res.status(200).send(product);
            }
        }catch(err) {
            console.log(err);
            return res.status(500).send("Something went Wrong");
        }
    }


    async rateProduct(req,res) {
        try{
            const userID = req.userID;
            const productID = req.body.productID;
            const rating = req.body.rating;   //server error
            console.log(rating);
            // try{
                await this.productRepository.rate(userID, productID, rating);  //if everything is fine it will return nothing
            // }catch(err){
            //     return res.status(400).send(err.message);
            // }
            return res.status(200).send("Rating has been added");
        }catch(err){
            console.log("this error message is passed to Application level middleware i.e. ApplicationError class");
            // next();
        }
    }

    async filterProducts(req,res) {
        try{
            const minPrice = req.query.minPrice;
            // const maxPrice = req.query.maxPrice;
            const categories = req.query.categories;
            // console.log(minPrice, maxPrice, category);
            const result = await this.productRepository.filter(minPrice,categories);
            // if (!result){
            //     res.status(404).send("product not found!!!");
            // }
            res.status(200).send(result);
            // if (result.length === 0) {
            //     res.status(404).send("No products found matching the criteria!");
            // } else {
            //     res.status(200).send(result);
            // }
        }catch(err) {
            console.log(err);
            return res.status(500).send("Something went Wrong");
        }
    }

    async averagePrice(req,res,next) {
        try{
            const result = await this.productRepository.averageProductPricePerCategory();
            console.log(result);
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(500).send("Something went Wrong");
        }
    }
}