import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String },
  priority: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', TaskSchema);
