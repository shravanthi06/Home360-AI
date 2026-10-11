
import mongoose, { Schema, Document } from "mongoose";

export interface IAIQuote extends Document {
  serviceName: string;
  providerName: string;
  price: number;
  warrantyMonths: number;
  estimatedDays: number;
  rating: number;
  description?: string;
  status: "Pending" | "Selected" | "Rejected";
}

const aiQuoteSchema = new Schema<IAIQuote>(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    providerName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    warrantyMonths: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Selected", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAIQuote>("AIQuote", aiQuoteSchema);
