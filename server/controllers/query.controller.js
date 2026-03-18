const Dataset = require('../models/Dataset');
const Query = require('../models/Query');
const aiService = require('../services/ai.service');

exports.processQuery = async (req, res, next) => {
  try {
    const { prompt, datasetId } = req.body;
    const dataset = await Dataset.findById(datasetId);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // 1. AI Parsing
    const parsed = await aiService.parseQuery(prompt, dataset.columns);

    // 2. Data Processing
    let chartData = [];
    const { metrics, dimensions, filters, intent } = parsed;

    // Filter data
    let filteredData = dataset.data;
    if (filters && Object.keys(filters).length > 0) {
      filteredData = filteredData.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          if (!row[key]) return false;
          return String(row[key]).toLowerCase() === String(value).toLowerCase();
        });
      });
    }

    if (intent === 'aggregation' && dimensions && dimensions.length > 0) {
      const grouped = {};
      filteredData.forEach(row => {
        const key = dimensions.map(d => row[d] || 'Unknown').join(' - ');
        if (!grouped[key]) {
          grouped[key] = { label: key };
          metrics.forEach(m => grouped[key][m] = 0);
          grouped[key]._count = 0;
        }
        
        grouped[key]._count++;
        metrics.forEach(m => {
          const val = parseFloat(String(row[m]).replace(/[^0-9.-]+/g, ""));
          if (!isNaN(val)) grouped[key][m] += val;
        });
      });

      // Average if needed (simple heuristic: if user asks for average, we'd need AI to tell us the operation)
      // For now, we'll stick to Sum but we could extend this.
      chartData = Object.values(grouped).sort((a, b) => b[metrics[0]] - a[metrics[0]]);
    } else {
      chartData = filteredData.slice(0, 100).map(row => ({
        ...row,
        label: row[dimensions?.[0]] || 'Item'
      }));
    }

    // 3. Save Query (Optional: req.user.id might be undefined if no auth)
    const query = new Query({
      userId: req.user.id,
      datasetId,
      prompt,
      response: {
        ...parsed,
        chartData
      }
    });

    await query.save();
    res.json(query);
  } catch (err) {
    next(err);
  }
};

exports.getQueries = async (req, res, next) => {
  try {
    const queries = await Query.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    next(err);
  }
};
