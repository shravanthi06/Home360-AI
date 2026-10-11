
import mongoose, { Schema, Document } from "mongoose";

export interface IHomePassport extends Document {
  homeName: string;
  address: string;
  propertyType: string;
  yearBuilt?: number;
  area?: number;
  notes?: string;
}

const homePassportSchema = new Schema<IHomePassport>(
  {
    homeName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    yearBuilt: {
      type: Number,
      min: 1800,
    },
    area: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHomePassport>(
  "HomePassport",
  homePassportSchema
);
