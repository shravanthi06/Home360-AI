import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  title: string;
  category: string;
  amount: number;
  dueDate: Date;
  status: "Paid" | "Pending";
  notes?: string;
}

const billSchema = new Schema<IBill>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBill>("Bill", billSchema);