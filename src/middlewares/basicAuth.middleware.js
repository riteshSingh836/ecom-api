import userModel from "../features/user/user.model.js";

const basicAuthorizer = (req,res,next) => {
    // 1. Check if authorization header is empty
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send("No authorization details found");
    }
    console.log("1 : " + authHeader);

    // 2. Extracting Credentials [basic 64mmscnasbdjnfkdsk]
    const base64Credentials = authHeader.replace('Basic ', '');
    console.log("2 : " + base64Credentials);

    // 3. Decoding Credentials
    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString("utf-8");    //[name:password]
    console.log("3 : " + decodedCreds);
    const creds = decodedCreds.split(':');  // array of two things i.e email & password.
    console.log("4 : " + creds);

    // 4. check whether credentials matches with the userlogin
    const user = userModel.getAll().find((u) => u.email == creds[0] && u.password == creds[1]);
    if (user) {
        next();
    }else{
        return res.status(401).send("Incorrect Credentials");
    }
}

export default basicAuthorizer;