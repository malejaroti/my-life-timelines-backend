import { Request, Response, NextFunction, Router } from 'express';
import Tag from '../models/Tag.model';
const router = Router();


//POST /api/tags - Create a new tag
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    try{
        const response = await Tag.create({name});
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
  try {
    const response = await Tag.findOneAndUpdate({ name: req.body.oldName }, { name: req.body.newName }, { new: true });
    res.status(200).json(response);
  } catch (error) {
    console.log("error updating tag name")
    next(error);
  }
})

//DELETE /api/tags - Delete a tag
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const tags = await Tag.findOneAndDelete({ name });
    res.status(204).json(tags);
  } catch (error) {
    next(error);
  }
});

const tagsRouter = router
export default tagsRouter