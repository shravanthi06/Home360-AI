
import mongoose, { Schema } from "mongoose";

const AIAdvisorSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "Your home advisor response will appear here.",
    },
    category: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIAdvisor", AIAdvisorSchema);
