import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Lead } from './models/Lead.js';
import { Note } from './models/Note.js';
import { Task } from './models/Task.js';
import { Call } from './models/Call.js';
import { Email } from './models/Email.js';
import { Deal } from './models/Deal.js';
import { Contact } from './models/Contact.js';
import { Organization } from './models/Organization.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_react')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('CRM Backend API is running!');
});

// GET all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// CREATE a lead
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error("Backend error creating lead:", error);
    res.status(500).json({ error: 'Failed to create lead', details: error.message });
  }
});

// GET single lead by ID
app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// NOTES
app.get('/api/notes', async (req, res) => {
  try {
    const query = req.query.leadId ? { leadId: req.query.leadId } : {};
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) { res.status(500).json({ error: 'Error fetching notes' }); }
});
app.post('/api/notes', async (req, res) => {
  try {
    const note = await new Note(req.body).save();
    res.status(201).json(note);
  } catch (error) { res.status(500).json({ error: 'Error saving note' }); }
});

// TASKS
app.get('/api/tasks', async (req, res) => {
  try {
    const query = req.query.leadId ? { leadId: req.query.leadId } : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) { res.status(500).json({ error: 'Error fetching tasks' }); }
});
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await new Task(req.body).save();
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ error: 'Error saving task' }); }
});

// CALLS
app.get('/api/calls', async (req, res) => {
  try {
    const query = req.query.leadId ? { leadId: req.query.leadId } : {};
    const calls = await Call.find(query).sort({ createdAt: -1 });
    res.json(calls);
  } catch (error) { res.status(500).json({ error: 'Error fetching calls' }); }
});
app.post('/api/calls', async (req, res) => {
  try {
    const call = await new Call(req.body).save();
    res.status(201).json(call);
  } catch (error) { res.status(500).json({ error: 'Error saving call' }); }
});

// EMAILS
app.get('/api/emails', async (req, res) => {
  try {
    const emails = await Email.find({ leadId: req.query.leadId }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) { res.status(500).json({ error: 'Error fetching emails' }); }
});
app.post('/api/emails', async (req, res) => {
  try {
    const email = await new Email(req.body).save();
    res.status(201).json(email);
  } catch (error) { res.status(500).json({ error: 'Error saving email' }); }
});

// WHATSAPP
app.get('/api/whatsapp', async (req, res) => {
  try {
    const messages = await Whatsapp.find({ leadId: req.query.leadId }).sort({ createdAt: 1 }); // Sort ascending for chat
    res.json(messages);
  } catch (error) { res.status(500).json({ error: 'Error fetching whatsapp' }); }
});
app.post('/api/whatsapp', async (req, res) => {
  try {
    const message = await new Whatsapp(req.body).save();
    res.status(201).json(message);
  } catch (error) { res.status(500).json({ error: 'Error saving whatsapp' }); }
});

// DEALS
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) { res.status(500).json({ error: 'Error fetching deals' }); }
});
app.post('/api/deals', async (req, res) => {
  try {
    const deal = await new Deal(req.body).save();
    res.status(201).json(deal);
  } catch (error) { res.status(500).json({ error: 'Error saving deal' }); }
});
app.put('/api/deals/:id', async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(deal);
  } catch (error) { res.status(500).json({ error: 'Error updating deal' }); }
});

// CONTACTS
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) { res.status(500).json({ error: 'Error fetching contacts' }); }
});
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await new Contact(req.body).save();
    res.status(201).json(contact);
  } catch (error) { res.status(500).json({ error: 'Error saving contact' }); }
});

// ORGANIZATIONS
app.get('/api/organizations', async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });
    res.json(organizations);
  } catch (error) { res.status(500).json({ error: 'Error fetching organizations' }); }
});
app.post('/api/organizations', async (req, res) => {
  try {
    const organization = await new Organization(req.body).save();
    res.status(201).json(organization);
  } catch (error) { res.status(500).json({ error: 'Error saving organization' }); }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
