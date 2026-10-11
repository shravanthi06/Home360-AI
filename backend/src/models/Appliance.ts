
import mongoose, { Schema, Document } from "mongoose";

export interface IAppliance extends Document {
  name: string;
  category: string;
  brand: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  price: number;
  condition: "Excellent" | "Good" | "Needs Repair";
  notes?: string;
}

const applianceSchema = new Schema<IAppliance>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpiry: {
      type: Date,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Needs Repair"],
      default: "Good",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAppliance>("Appliance", applianceSchema);
