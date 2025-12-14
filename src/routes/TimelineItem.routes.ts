import { Request, Response, NextFunction, Router } from 'express';
import mongoose from "mongoose";
import Timeline from "../models/Timeline.model"
import TimelineItem from '../models/TimelineItem.model';
import { JwtPayload } from '../types/auth';
import Tag, {type ITag} from '../models/Tag.model';

// ‼️ All routes in this router are prefixed with /api/timelines/:timelineId
const router = Router({ mergeParams: true }); 

//POST /api/timelines/:timelineId/items - Create a new timeline item
router.post("/items", async (req: Request, res: Response, next: NextFunction) => {

  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: creator } = req.payload as JwtPayload;
  const {timelineId : timeline} = req.params
  let isApproved = false
  const foundTimeline = await Timeline.findById(timeline);
  if (foundTimeline !== null){
    if(foundTimeline.owner.toString() === creator){
      isApproved = true
    }else{
      isApproved = false
    }
  }

  const {title, kind, description, startDate, endDate, images, impact, tags} = req.body;

  if(!title){
    const errorMessage = 'Timeline item name is required';
    console.log(`Error: ${errorMessage}`);
    res.status(400).json({errorMessage: errorMessage});
    return
  }

  // If no endDate is provided, use today's date (present)
  const finalEndDate = endDate ?? new Date();
  let tagIds: String[] = []
  try {
    tagIds = await updateItemTags(tags);
  } catch (tagError) {
    console.log(`Error updating/creating tags`);
    next(tagError);
  }
  try {
    const response = await TimelineItem.create({
        timeline, creator, title, kind, description, startDate, endDate, images, impact, tags:tagIds, isApproved
    });
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }

});

const updateItemTags = async (tags: ITag[])=>{
  const existingTags: ITag[] = tags.filter((tag: ITag) => tag._id)
  console.log("Existing tags (already have id): ", existingTags);
  const newTagsToCreate = tags
    .filter((tag: ITag) => !tag._id && tag.name); // Filter out tags without names

  const newTags: ITag[] = await Promise.all(
    newTagsToCreate
    .map((tag: ITag) => 
      Tag.create({name: tag.name.trim().charAt(0).toUpperCase() + tag.name.trim().slice(1).toLowerCase()})
    )
  );
  console.log("new tags created", newTags);
  const finalTags = [...existingTags.map((tag) => tag._id), ...newTags.map((tag) => tag._id)];
  console.log("Final array all tags", finalTags);
  return finalTags
}

//GET /api/timelines/:timelineId/items - Get all of the items of one timeline item
router.get("/items", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: loggedUserId } = req.payload as JwtPayload;
  
  console.log("req.params", req.params);
  const { timelineId, itemId } = req.params;
  
  try {
    const foundTimeline = await Timeline.findById(timelineId)
    if (!foundTimeline) return res.status(404).json({ message: "Timeline not found" });

    // Check if timeline is public OR user is owner/collaborator/creator
    const isPublic = false; //foundTimeline.isPublic;
    const isTimelineOwner = foundTimeline.owner.toString() === loggedUserId;
    const isCollaborator = Array.isArray(foundTimeline.collaborators) && foundTimeline.collaborators.some((collab) => collab.toString() === loggedUserId.toString());
    
    if (isTimelineOwner || isCollaborator) {
      const response = await TimelineItem.find({timeline : timelineId})
        .sort({ startDate: 1, endDate: 1, _id: 1 }) // Return items in ascending chronological order. _id breaks ties deterministically
        .populate("tags", "_id name"); // Populate tags but only return name and id field
      res.status(200).json(response);
    } else {
      return res.status(403).json({ errorMessage: "Access denied.User is neither timeline owner, nor creator of the item, nor timeline collaborator" });
    }
    
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET /api/timelines/:timelineId/items/:itemId - Get details of one timeline item
router.get("/items/:itemId", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });
  const { _id: loggedUserId } = req.payload as JwtPayload;
  
  console.log("req.params", req.params);
  const { timelineId, itemId } = req.params;
  
  try {
    const foundTimeline = await Timeline.findById(timelineId);
    if (!foundTimeline) return res.status(404).json({ message: "Timeline not found" });
    const foundTimelineItem = await TimelineItem.findById(itemId);
    if (!foundTimelineItem) return res.status(404).json({ message: "Timeline item not found" });
    
    // Check if timeline is public OR user is owner/collaborator/creator
    const isPublic = false; //foundTimeline.isPublic;
    const isTimelineOwner = foundTimeline.owner.toString() === loggedUserId;
    const isItemCreator = foundTimelineItem.creator.toString() === loggedUserId;
    const isCollaborator = Array.isArray(foundTimeline.collaborators) && foundTimeline.collaborators.some((collab) => collab.toString() === loggedUserId.toString());
    
    if (isTimelineOwner || isItemCreator || isCollaborator) {
      const response = await TimelineItem.findById(itemId);
      res.status(200).json(response);
    } else {
      return res.status(403).json({ errorMessage: "Access denied.User is neither timeline owner, nor creator of the item, nor timeline collaborator" });
    }
    
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// PUT /api/timelines/:timelineId/items/:itemId - Edit a timeline item 
router.put("/items/:itemId", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.payload) return res.status(401).json({ errorMessage: "no payload" });

  const { _id: loggedUserId } = req.payload as JwtPayload;
  const { timelineId, itemId } = req.params;
  console.log(`timelineId from req.params: ${timelineId}`);
  
  // if (!mongoose.isValidObjectId(timelineId)) {
  //   return res.status(400).json({ message: "Invalid ObjectId format for TimelineId" });
  // }

  
  try {
    const foundTimeline = await Timeline.findById(timelineId);
    if (!foundTimeline) return res.status(404).json({ message: "Timeline not found" });
    const foundTimelineItem = await TimelineItem.findById(itemId);
    if (!foundTimelineItem) return res.status(404).json({ message: "Timeline item not found" });
    
    // Check if timeline is public OR user is owner/collaborator/creator
    const isPublic = false; //foundTimeline.isPublic;
    const isTimelineOwner = foundTimeline.owner.toString() === loggedUserId;
    const isItemCreator = foundTimelineItem.creator.toString() === loggedUserId;
    const isCollaborator = Array.isArray(foundTimeline.collaborators) && 
    foundTimeline.collaborators.some(
      (collab) => collab.toString() === loggedUserId.toString());
      
      if (isTimelineOwner || isItemCreator || isCollaborator) {
        const { timeline, title, description, startDate, endDate, images, tags } = req.body;
        const updates: any = {};
        if (timeline !== undefined) updates.timeline = timeline;
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (startDate !== undefined) updates.startDate = startDate;
        if (endDate !== undefined) updates.endDate = endDate;
        if (images !== undefined) updates.images = images;
        if (tags !== undefined){
          try {
            updates.tags = await updateItemTags(tags);
          } catch (tagError) {
            console.log(`Error updating/creating tags`);
            next(tagError);
          }
        }
        
        const response = await TimelineItem.findByIdAndUpdate(
          itemId,
          { $set: updates },
          { new: true }
        );
        res.status(200).json(response);
      } else {
      return res.status(403).json({ errorMessage: "Edit access denied. User is neither timeline owner, nor creator of the item, nor timeline collaborator" });
    } 

  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE /api/timelines/:timelineId/items/:itemId - Remove a timeline item
router.delete("/items/:itemId", async (req: Request, res: Response, next: NextFunction) => {
  const { _id: userId } = req.payload as JwtPayload;
  const {timelineId, itemId} = req.params

  const foundTimeline = await Timeline.findById(timelineId);
  const foundTimelineItem = await TimelineItem.findById(itemId);
  if (foundTimeline === null ){
    return res.json({errMsg: "Timeline does not exist"});
  }
  if (foundTimelineItem === null ){
    return res.json({errMsg: "Timeline item does not exist"});
  }

  //if user is owner of the timeline or creator of the item, it can delete it, otherwise not
  if(foundTimeline.owner.toString() === userId || foundTimelineItem.creator.toString() === userId){
    try {
      const response = await TimelineItem.findByIdAndDelete(itemId,
        { new: true } // return the deleted item
      );
      res.status(200).json(response); //* 200 Ok
  
    } catch (error) {
      console.log(error);
      next(error);
    }
  }else{
    return res.json({errMsg: "User is neither creator of the item, nor owner of the timeline. Permission to delete denied"});
  }

});

// module.exports = router
const timelineItemRouter = router
export default timelineItemRouter