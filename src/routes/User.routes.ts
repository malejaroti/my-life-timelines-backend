import { Request, Response, NextFunction, Router } from 'express';
import User from "../models/User.model"
import { JwtPayload } from '../types/auth';

const router = Router()

//GET / - Get all users (username profilePicture and email )
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: userId } = req.payload as JwtPayload;  
 
  try {
    const response = await User.find().select("name username profilePicture email" );
    // console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET / - Get logged user details (username profilePicture and email )
router.get("/logged-user", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: userId } = req.payload as JwtPayload;  
 
  try {
    const response = await User.findById( userId ).select("name username profilePicture email" );
    // console.log(response)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


//PATCH /api/user/friends - Add a new friend
router.patch("/friends", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: owner } = req.payload as JwtPayload;

  
  // console.log(req.body);
  // const {title, icon, description, isPublic, color } = req.body;
  // try {
  //   const response = await User.findByIdAndUpdate({
  //       owner, title, icon, description, isPublic, color
  //   });
  //   res.status(201).json(response);
  // } catch (error) {
  //   console.log(error);
  //   next(error);
  // }
});



// module.exports = router
const userRouter = router
export default userRouter 