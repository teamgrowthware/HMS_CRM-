import mongoose from 'mongoose';

const WhatsappSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Sent', 'Received'], default: 'Sent' },
  status: { type: String, enum: ['Sent', 'Delivered', 'Read'], default: 'Delivered' },
  createdAt: { type: Date, default: Date.now }
});

export const Whatsapp = mongoose.model('Whatsapp', WhatsappSchema);
