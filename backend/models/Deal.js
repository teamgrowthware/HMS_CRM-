import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  dealName: { type: String, required: true },
  organization: { type: String, default: '' },
  contact: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  stage: { 
    type: String, 
    enum: ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Id. Decision Makers', 'Perception Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'], 
    default: 'Prospecting' 
  },
  owner: { type: String, default: 'Shariq Ansari' },
  closingDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Deal = mongoose.model('Deal', DealSchema);
