import LikeRepository from "./like.repository.js";

export default class LikeController{
    constructor() {
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req,res) {
        try{
            const{id, type} = req.body;
            const userID = req.userID;
            if (type != 'Product' && type != 'Category') {
                return res.status(400).send("Invalid type");
            }
            if (type == 'Product') {
                await this.likeRepository.likeProduct(userID, id);
            }else{
                await this.likeRepository.likeCategory(userID, id);
            }
            return res.status(200).send("Likes has been added");
        }catch(err){
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }

    async getAllLikes(req,res) {
        try{
            const{id, type} = req.query;
            const allLikes = await this.likeRepository.getAllLikes(id, type);
            return res.status(200).send(allLikes);
        }catch(err){
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }
}