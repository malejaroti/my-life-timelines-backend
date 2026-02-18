import { Request, Response, NextFunction, Router } from 'express';
import TimelineItem from '../models/TimelineItem.model';
import { JwtPayload } from '../types/auth';
const router = Router();

//GET /api/items - Get up to N recent items (default 10)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "Authentication required" });
  const { _id: loggedUserId } = req.payload as JwtPayload;
  try {
    const { limit: limitParam } = req.query;
    
    // Parse and validate the limit parameter from query string
    // Ensure it's a finite number between 1-50, default to 10 if invalid
    const limitFromQuery = Number(limitParam);
    const limit = Number.isFinite(limitFromQuery)
      ? Math.max(1, Math.min(50, Math.trunc(limitFromQuery)))
      : 10;

    const items = await TimelineItem.find({ creator: loggedUserId })
    // Return items in descending chronological order (most recent first), if startDate is the same, sort by endDate. If both are the same, the order is determined by _id which is unique and monotonically increasing. This ensures a deterministic order.
        .sort({ startDate: -1, endDate: -1, _id: -1 })
        .limit(limit)
        .populate("timeline");
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const itemsRouter = router
export default itemsRouter
