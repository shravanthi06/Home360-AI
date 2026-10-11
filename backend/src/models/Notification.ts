
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "Bill" | "Maintenance" | "Service" | "Schedule" | "General";
  isRead: boolean;
  dueDate?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Bill", "Maintenance", "Service", "Schedule", "General"],
      default: "General",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
