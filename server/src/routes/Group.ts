import { Request, Response, Router } from "express";
import { User, Group } from "../models";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, user } = req.body;
      
    try{
        const potentialGroup = await Group.findOne({ name });

        if(potentialGroup){
            return res.status(401).json({message:"GroupId Is taken", error: "Group ID is taken"});
        }else{
            await Group.create( { name }).then( ( { name } ) => {
                return res.status(200).json({message:`Group: ${ name } successfully created`});
            }).catch( (error) => {
                return res.status(400).json({message: error})
            })
        }
      
        }catch(error){
            res.status(400).json({message:"Error", error: error.message});
    }
});

router.post('/join', async (req: Request, res: Response) => {
    const { name, user } = req.body;

    try{
        const potentialGroup = await Group.findOne({ name });
        
        if(!potentialGroup){
            return res.status(401).json({message: `${name} does not exist.`});
        }else{
            
        }
    }catch(error){
        return res.status(400).json({message : error});
    }
});

export default router;
