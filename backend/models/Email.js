import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: 'Sent' },
  createdAt: { type: Date, default: Date.now }
});

export const Email = mongoose.model('Email', EmailSchema);
