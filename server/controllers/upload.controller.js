const Dataset = require('../models/Dataset');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Simple type detection
        if (results.length === 0) {
          return res.status(400).json({ message: 'CSV file is empty' });
        }

        const keys = Object.keys(results[0]);
        const columns = keys.map(key => {
          const sampleValue = results[0][key];
          let type = 'string';
          if (!isNaN(sampleValue) && sampleValue.trim() !== '') {
            type = 'number';
          } else if (!isNaN(Date.parse(sampleValue))) {
            type = 'date';
          }
          return { name: key, type };
        });

        const dataset = new Dataset({
          userId: req.user.id,

          name: req.file.originalname,
          columns,
          data: results
        });

        await dataset.save();
        
        // Clean up temp file
        fs.unlinkSync(req.file.path);

        res.status(201).json(dataset);
      });
  } catch (err) {
    next(err);
  }
};

exports.getDatasets = async (req, res, next) => {
  try {
    const datasets = await Dataset.find({ userId: req.user.id }).select('-data');
    res.json(datasets);
  } catch (err) {
    next(err);
  }
};
exports.deleteDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found or unauthorized' });
    }

    res.json({ message: 'Dataset deleted successfully' });
  } catch (err) {
    next(err);
  }
};
