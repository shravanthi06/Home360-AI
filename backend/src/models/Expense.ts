
import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  title: string;
  category: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  notes?: string;
}

const expenseSchema = new Schema<IExpense>(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      default: "Other",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", expenseSchema);
