
import { Request, Response, NextFunction, Router } from 'express';
import Tag from '../models/Tag.model';
const router = Router();


//POST /api/tags - Create a new tag
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (  
        typeof name !== 'string' ||  
        !name.trim() ||  
        name.trim().length < 1 ||  
        name.trim().length > 50  
    ) {  
        return res.status(400).json({ error: "Invalid 'name' field: must be a non-empty string between 1 and 50 characters." });  
    }  

    try{  
        const response = await Tag.create({name: name.trim()});  
        res.status(201).json(response)
    } catch (error) {
        next(error);
    }
});

//GET /api/tags - Get all tags
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }); // Sort tags alphabetically
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
});

//PATCH /api/tags - Update a tag
router.patch("/", async (req:Request, res:Response, next: NextFunction) => {
  const { oldName, newName } = req.body;  
  if (  
    typeof oldName !== 'string' || oldName.trim() === '' ||  
    typeof newName !== 'string' || newName.trim() === ''  
  ) {  
    return res.status(400).json({ error: "Both oldName and newName must be provided as non-empty strings." });  
//PATCH /api/tags/:name - Update a tag by name
router.patch("/:name", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name: newName } = req.body;
    const { name: oldName } = req.params;
    const response = await Tag.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true });
    res.status(200).json(response);
  } catch (error) {
    console.log("error updating tag name");
    next(error);
  }
});

//DELETE /api/tags/:name - Delete a tag
router.delete("/:name", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.params;
    const tags = await Tag.findOneAndDelete({ name });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

const tagsRouter = router
export default tagsRouter