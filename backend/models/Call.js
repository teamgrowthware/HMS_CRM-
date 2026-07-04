import mongoose from 'mongoose';

const CallSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  type: { type: String, enum: ['Outgoing', 'Incoming'], default: 'Outgoing' },
  duration: { type: String, default: '00:00' },
  status: { type: String, default: 'Completed' },
  createdAt: { type: Date, default: Date.now }
});

export const Call = mongoose.model('Call', CallSchema);
