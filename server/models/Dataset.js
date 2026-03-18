const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  columns: [{
    name: { type: String, required: true },
    type: { type: String, required: true } // 'number', 'string', 'date'
  }],
  data: [mongoose.Schema.Types.Mixed], // Store parsed CSV data
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dataset', datasetSchema);
