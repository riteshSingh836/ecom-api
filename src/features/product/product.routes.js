// Manage routes/path to product controllers

// 1. import express (becz express provides routes)
import express from "express";
import ProductController from "./product.controller.js";
import {fileupload} from "../../middlewares/fileupload.middleware.js";

// 2. Get Router
const productRouter = express.Router(); //when path matches, then call that particular method in controller.

const productController = new ProductController();

productRouter.post('/rate', (req,res)=> {
        productController.rateProduct(req,res);
});
productRouter.get('/filter', (req,res)=> {
        productController.filterProducts(req,res);
}); // need to written upward

productRouter.get('/', (req,res)=>{
        productController.getAllProducts(req,res);
    }) ;
productRouter.post('/',fileupload.single('imageUrl'), (req,res)=> {
        productController.addProduct(req,res);  
});

productRouter.get('/averagePrice', (req,res)=> {        //put before get:id
        productController.averagePrice(req,res);
});

productRouter.get('/:id', (req,res)=> {
        productController.getOneProduct(req,res);
});

// localhost:3500/api/products/filter?minPrice=10&maxPrice=20&category=category1

export default productRouter;


