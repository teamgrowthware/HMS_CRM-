import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  salutation: String,
  firstName: { type: String, required: true },
  lastName: String,
  email: String,
  mobileNo: String,
  gender: String,
  organization: String,
  website: String,
  noOfEmployees: String,
  territory: String,
  annualRevenue: Number,
  industry: String,
  status: { type: String, default: 'New' },
  owner: { type: String, default: 'Shariq Ansari' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', LeadSchema);
