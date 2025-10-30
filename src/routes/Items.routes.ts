import { Request, Response, NextFunction, Router } from 'express';
import TimelineItem from '../models/TimelineItem.model';
import { start } from 'repl';
const router = Router();

//GET /api/items - Get all items
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await TimelineItem.find({
        startDate: { $gt: new Date("2024-12-31") } // Filter items from current year onwards
      })
        .sort({ endDate: -1, startDate: -1 }) // Return items in descending chronological order.
        .limit(10) // Limit to 10 items to avoid overload
        .populate("timeline") // Populate timeline details
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

const itemsRouter = router
export default itemsRouter
