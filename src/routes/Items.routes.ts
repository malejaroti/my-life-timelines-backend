import { Request, Response, NextFunction, Router } from 'express';
import TimelineItem from '../models/TimelineItem.model';
const router = Router();

//GET /api/items - Get up to N recent items (default 10)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit: limitParam, startDate: startDateParam } = req.query;
    
    // Parse and validate the limit parameter from query string
    // Ensure it's a finite number between 1-50, default to 10 if invalid
    const limitFromQuery = Number(limitParam);
    const limit = Number.isFinite(limitFromQuery)
      ? Math.max(1, Math.min(50, Math.trunc(limitFromQuery)))
      : 10;

    const startDateFromQuery = startDateParam ? new Date(String(startDateParam)) : null;
    const defaultStartDate = new Date(new Date().getFullYear(), 0, 1); // January 1st of the current year
    const startDateFilter = startDateFromQuery && !isNaN(startDateFromQuery.getTime())
      ? startDateFromQuery
      : defaultStartDate;

    const items = await TimelineItem.find({
        startDate: { $gt: startDateFilter }
      })
        .sort({ endDate: -1, startDate: -1 })
        .limit(limit)
        .populate("timeline");
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

const itemsRouter = router
export default itemsRouter
