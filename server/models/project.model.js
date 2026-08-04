import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  created: { type: Date, default: Date.now }
});

export default mongoose.model("Project", projectSchema);
