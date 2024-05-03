import multer from "multer";

const storageConfig = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './uploads/');
    },
    filename: (req,file,cb) => {
        // console.log("hii");
        const name = new Date().toISOString().replace(/:/g, '_') + '-' + file.originalname;
        cb(null, name);
    }
});

export const fileupload = multer({storage: storageConfig}); //multer as a function, inside options