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
      
      // If the AI didn't provide any numeric metrics but wants an aggregation, 
      // it's likely a count query. We'll add 'Count' to metrics.
      const actualMetrics = [...metrics];
      if (actualMetrics.length === 0) {
        actualMetrics.push('Count');
      }

      filteredData.forEach(row => {
        const key = dimensions.map(d => row[d] || 'Unknown').join(' - ');
        if (!grouped[key]) {
          grouped[key] = { label: key };
          actualMetrics.forEach(m => grouped[key][m] = 0);
        }
        
        // Always increment the 'Count' if it exists in our metrics
        if (grouped[key].hasOwnProperty('Count')) {
          grouped[key]['Count']++;
        }

        // Add up other metrics if they exist
        metrics.forEach(m => {
          const val = parseFloat(String(row[m]).replace(/[^0-9.-]+/g, ""));
          if (!isNaN(val)) grouped[key][m] += val;
        });
      });

      // Update metrics array in parsed object so frontend knows what to render
      parsed.metrics = actualMetrics;

      // Sort by the primary metric
      const primaryMetric = actualMetrics[0];
      chartData = Object.values(grouped).sort((a, b) => b[primaryMetric] - a[primaryMetric]);

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
