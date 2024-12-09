import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Car = mongoose.model("Car", carSchema);
export default Car;
