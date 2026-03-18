const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
  prompt: { type: String, required: true },
  response: {
    intent: String,
    metrics: [mongoose.Schema.Types.Mixed],

    dimensions: [String],
    filters: mongoose.Schema.Types.Mixed,
    chartType: String,
    chartData: [mongoose.Schema.Types.Mixed]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', querySchema);
