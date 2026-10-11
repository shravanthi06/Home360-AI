
import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenance extends Document {
  title: string;
  category: string;
  description: string;
  scheduledDate: Date;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  estimatedCost: number;
  notes?: string;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
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
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMaintenance>("Maintenance", maintenanceSchema);
