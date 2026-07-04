import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  salutation: { type: String, default: 'Mr' },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, default: '' },
  mobileNo: { type: String, default: '' },
  organization: { type: String, default: '' },
  designation: { type: String, default: '' },
  owner: { type: String, default: 'Shariq Ansari' },
  createdAt: { type: Date, default: Date.now }
});

export const Contact = mongoose.model('Contact', ContactSchema);
