import { ApplicationError } from "../../error-handler/applicationError.js";
import userModel from "../user/user.model.js";


export default class productModel {
    constructor(name,desc,price,imageUrl,category,sizes,id) {
        this.name = name;
        this.desc = desc;
        this.price = price; //NOTE: changing sequence here, will affect-- POSTMAN request & database storage.
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
        this._id = id;
    }

    static add(product) {
        product.id = products.length + 1;
        products.push(product);
        return products;
    }

    static get(id) {
        const product = products.find((i) => i.id == id);
        return product;
    }

    static GetAll() {
        return products;
    }

    static filter(minPrice, maxPrice, category) {
        const result = products.filter((product) => {
            return ( (!minPrice || product.price >= minPrice) && 
            (!maxPrice || product.price <= maxPrice) && 
            (!category || product.category == category));
        });
        // console.log(result);
        return result;
    }

    // Rating
    static rateProduct (userID, productID, rating) {
        // validate user
        const user = userModel.getAll().find((u) => u.id == userID);
        // console.log(user);
        if (!user) {
            throw new ApplicationError("User not found", 404);
        }
        // validate product
        const product = products.find((p) => p.id == productID);
        if (!product) {
            throw new ApplicationError("Product not found", 400);
        }

        // check if there are rating, if not, create one.
        if (!product.ratings) {
            product.ratings = [];
            product.ratings.push({userID: userID, rating: rating});
        }else{
            const existingRatingIndex = product.ratings.findIndex((r) => r.userID == userID);
            if (existingRatingIndex >= 0) {
                product.ratings[existingRatingIndex] = {userID: userID, rating: rating};
            }else{
                product.ratings.push({userID: userID, rating: rating});
            }
        }
    }
}

var products = [new productModel(1, 'Iphone11', 'created by Apple', '19.99', 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6223/6223303_sd.jpg', 'category1'),
new productModel(2, 'Iphone12', 'made in China', '29.99', 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6223/6223303_sd.jpg', 'category2', ['M','XL']),
new productModel(3, 'Iphone13', 'made in India', '39.99', 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6223/6223303_sd.jpg', 'category3', ['M','XL','S'])];

// var products = [
//     new productModel(
//       1,
//       'Product 1',
//       'Description for Product 1',
//       19.99,
//       'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
//       'Cateogory1'
//     ),
//     new productModel(
//       2,
//       'Product 2',
//       'Description for Product 2',
//       29.99,
//       'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
//       'Cateogory2',
//       ['M', 'XL']
//     ),
//     new productModel(
//       3,
//       'Product 3',
//       'Description for Product 3',
//       39.99,
//       'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
//       'Cateogory3',
//       ['M', 'XL','S']
//     )];