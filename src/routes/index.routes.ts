import { Request, Response, NextFunction, Router } from 'express';
import validateToken from '../middlewares/auth.middleware';
import authRouter from "../routes/auth.routes"
import timelineRouter from "../routes/Timeline.routes"
import uploadRouter from "../routes/upload.routes"
import userRouter from "../routes/User.routes"
import itemsRouter from "../routes/Items.routes"

const router = Router();

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.use("/auth", authRouter)
router.use("/timelines", validateToken, timelineRouter);
router.use("/items", validateToken, itemsRouter);
router.use("/upload", validateToken, uploadRouter);
router.use("/users", validateToken, userRouter);

export default router