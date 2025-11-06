import { Schema, model, Document } from "mongoose";

export interface ITimelineItem extends Document {
  timeline: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  // kind?: String;
  title: String;
  description?: String;
  startDate: Date;
  endDate?: Date;
  images?: [string]
  impact?: String;
  tags?: [String];
  isApproved?: Boolean,
  comments?: [Schema.Types.ObjectId],  
  createdAt: Date; // added automatically
  updatedAt: Date; // added automatically
}

const timelineItemSchema = new Schema<ITimelineItem>(
  {
    timeline: {
        type: Schema.Types.ObjectId,
        ref: "Timeline",
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Timeline",
        required: true
    },
    // kind: { 
    //     type: String, 
    //     enum: ["event","person","book","movie","series","course"], 
    //     required: false,
    //     default: "event"
    // },
    title: {
      type: String,
      required: [true, "Title is required"],
      // unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: true, 
    },
    endDate: {
      type: Date,
      required: false, 
    },
    images: {
      type:[String],
      required: false,
    },
    impact: {
        type: String,
        enum: [
            "positive",   // 🚀 good outcome, motivating
            "negative",   // ⚠️ draining, distracting
            "neutral",    // ◽ just a fact / neither good nor bad
            "milestone",  // ⭐ big achievement / turning point
            "challenge",  // 💪 tough but growth-oriented
        ],
        default: "neutral"
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: "Tag",
        required: false
    },
    comments: {
      type:[Schema.Types.ObjectId],
      ref: "Comment",
      required: false
    },
    isApproved :{
      type: Boolean,
      required: false
    }
  },
  { timestamps: true } // adds createdAt / updatedAt fields
);


// Compound index on (timelineId, startDate, _id)
// - Purpose: Optimizes queries that fetch all items in a given timeline,
//   sorted chronologically (oldest → newest).
// - timelineId: narrows results to a single timeline efficiently.
// - startDate: ensures MongoDB can return documents already ordered by date,
//   instead of doing an expensive in-memory sort.
// - _id: used as a tiebreaker when multiple items share the same startDate,
//   and also enables efficient, stable pagination with a "cursor" approach.
// Without this index, queries like `.find({ timelineId }).sort({ startDate: 1, _id: 1 })`
// would get slower as the collection grows, because MongoDB would have to scan
// and sort results every time instead of just reading them in order.
timelineItemSchema.index({ timelineId: 1, startDate: 1, _id: 1 });

const TimelineItem = model<ITimelineItem>("TimelineItem", timelineItemSchema);

export default TimelineItem;
