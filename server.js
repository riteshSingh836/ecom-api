import './env.js';

import express from 'express';
import swagger from 'swagger-ui-express';
import cors from "cors";

import productRouter from './src/features/product/product.routes.js';
import bodyParser from 'body-parser';
import userRouter from './src/features/user/user.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.routes.js';

import apiDocs from './swagger.json' assert{type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import applicationErrorMiddleware from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import likeRouter from './src/features/like/like.routes.js';

const server = express();

server.use(bodyParser.json());  //Parsing is Important to read the client post request raw JSON file. or express/json().

// CORS
var corsOptions = {
    origin: 'http://localhost:5500',
    // allowedHeaders: ['Authorization', 'Content-Type'],
}
server.use(cors(corsOptions));

// SWAGGER
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));

// logger Middleware
server.use(loggerMiddleware);

server.use('/api/users', userRouter); 
server.use('/api/products', jwtAuth, productRouter); //PRODUCTS
server.use('/api/cartItems', jwtAuth, cartRouter);  //CARTITEMS
server.use('/api/orders', jwtAuth, orderRouter);
server.use('/api/likes', jwtAuth, likeRouter);

server.get('/', (req,res) => {
    res.send('Welcome to Ecommerce APIs');
})

// Error handler middleware     -- should be at the last
server.use(applicationErrorMiddleware);

// Middleware to handle 404 requests --- keep it at end , not starting
server.use((req,res) => {
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3500/api-docs");
})

server.listen(3500, ()=> {
    console.log('Server is listening to 3500');
    // connectToMongoDB();
    connectUsingMongoose();
})