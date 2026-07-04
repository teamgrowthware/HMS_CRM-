import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, default: '' },
  website: { type: String, default: '' },
  noOfEmployees: { type: String, default: '' },
  annualRevenue: { type: String, default: '' },
  territory: { type: String, default: '' },
  owner: { type: String, default: 'Shariq Ansari' },
  createdAt: { type: Date, default: Date.now }
});

export const Organization = mongoose.model('Organization', OrganizationSchema);
