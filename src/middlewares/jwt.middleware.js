import jwt from "jsonwebtoken";

const jwtAuth = (req,res,next) => {
    // 1.Read the toekn
    const token = req.headers["authorization"];

    // 2.if no token, return the error
    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    // 3. check if token is valid
    try {
        const payload = jwt.verify(token, "vd5F1vjcdYUBRO9ZQiHXSSjFKuDH7Hli");
        
        req.userID = payload.userID;    // IMP for accessing while creating cart controller
        // console.log(payload);
    }catch(err) {
        return res.status(401).send("Unauthorized");
    }

    next();
}

export default jwtAuth;