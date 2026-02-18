import { Request, Response, NextFunction, Router } from 'express';
import TimelineItem from '../models/TimelineItem.model';
const router = Router();

//GET /api/items - Get up to N recent items (default 10)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit: limitParam } = req.query;
    
    // Parse and validate the limit parameter from query string
    // Ensure it's a finite number between 1-50, default to 10 if invalid
    const limitFromQuery = Number(limitParam);
    const limit = Number.isFinite(limitFromQuery)
      ? Math.max(1, Math.min(50, Math.trunc(limitFromQuery)))
      : 10;

    const items = await TimelineItem.find()
        .sort({ startDate: -1, endDate: -1 })
        .limit(limit)
        .populate("timeline");
      // console.log("Items retrieved with filters - Limit:", limit, "Items found:", items.length);
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const itemsRouter = router
export default itemsRouter
