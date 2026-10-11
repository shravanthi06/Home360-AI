
import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  month: string;
  year: number;
  totalBudget: number;
  notes?: string;
}

const budgetSchema = new Schema<IBudget>(
  {
    month: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

budgetSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model<IBudget>("Budget", budgetSchema);

