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

    if (intent === 'aggregation') {
      const grouped = {};
      const actualMetrics = metrics.map(m => m.label || m.field);
      
      // Default to "Count" if no metrics provided
      if (actualMetrics.length === 0) {
        actualMetrics.push('Count');
      }

      const isGlobal = !dimensions || dimensions.length === 0;

      filteredData.forEach(row => {
        const key = isGlobal ? 'Total' : dimensions.map(d => row[d] || 'Unknown').join(' - ');
        
        if (!grouped[key]) {
          grouped[key] = { label: key };
          actualMetrics.forEach(m => grouped[key][m] = 0);
          // For averages, we need to track counts
          grouped[key]._counts = {};
          actualMetrics.forEach(m => grouped[key]._counts[m] = 0);
        }

        metrics.forEach((m, idx) => {
          const metricLabel = m.label || m.field;
          const val = parseFloat(String(row[m.field]).replace(/[^0-9.-]+/g, ""));
          
          if (m.op === 'count') {
            grouped[key][metricLabel]++;
          } else if (!isNaN(val)) {
            if (m.op === 'sum' || m.op === 'avg') {
              grouped[key][metricLabel] += val;
            } else if (m.op === 'min') {
              grouped[key][metricLabel] = Math.min(grouped[key][metricLabel], val);
            } else if (m.op === 'max') {
              grouped[key][metricLabel] = Math.max(grouped[key][metricLabel], val);
            }
            grouped[key]._counts[metricLabel]++;
          }
        });

        // Special case: if the AI just gave an empty metrics array, it wants a row count
        if (metrics.length === 0) {
          grouped[key]['Count']++;
        }
      });

      // Finalize averages
      Object.values(grouped).forEach(group => {
        metrics.forEach(m => {
          const metricLabel = m.label || m.field;
          if (m.op === 'avg' && group._counts[metricLabel] > 0) {
            group[metricLabel] = group[metricLabel] / group._counts[metricLabel];
          }
        });
      });

      // Update metrics array for frontend
      parsed.metrics = actualMetrics;

      // Prepare chartData
      chartData = Object.values(grouped);
      
      // Sort if not global
      if (!isGlobal && actualMetrics.length > 0) {
        chartData.sort((a, b) => b[actualMetrics[0]] - a[actualMetrics[0]]);
      }

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
    const { datasetId } = req.query;
    const filter = { userId: req.user.id };
    if (datasetId) filter.datasetId = datasetId;

    const queries = await Query.find(filter).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    next(err);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const dataset = await Dataset.findById(req.params.datasetId);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const suggestions = await aiService.generateSuggestions(dataset.columns);
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};


