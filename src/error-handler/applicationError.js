import mongoose from "mongoose";

export class ApplicationError extends Error {
    constructor(message,code) {
        super(message); // here the name message is different from that interface message
        this.code = code;   
        // therefore, if - errMessage, write err.message in middleware (not err.errMessage).
    }
}
const applicationErrorMiddleware = (err,req,res,next) => {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send(err.message);
    }
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }else{
        res.status(500).send("Something went wrong, Please try again later");
    }
    next();
}
export default applicationErrorMiddleware;