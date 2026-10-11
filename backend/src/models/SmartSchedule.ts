
import mongoose, { Schema, Document } from "mongoose";

export interface ISmartSchedule extends Document {
  title: string;
  description?: string;
  category: string;
  scheduledDate: Date;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  reminderEnabled: boolean;
}

const smartScheduleSchema = new Schema<ISmartSchedule>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    reminderEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISmartSchedule>(
  "SmartSchedule",
  smartScheduleSchema
);
