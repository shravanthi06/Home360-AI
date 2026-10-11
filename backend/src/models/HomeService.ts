
import mongoose, { Schema, Document } from "mongoose";

export interface IHomeService extends Document {
  serviceType: string;
  providerName: string;
  description: string;
  scheduledDate: Date;
  amount: number;
  status: "Requested" | "Accepted" | "In Progress" | "Completed" | "Cancelled";
  notes?: string;
}

const homeServiceSchema = new Schema<IHomeService>(
  {
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    providerName: {
      type: String,
      default: "Not assigned",
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Requested", "Accepted", "In Progress", "Completed", "Cancelled"],
      default: "Requested",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHomeService>("HomeService", homeServiceSchema);
