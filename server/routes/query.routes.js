const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, queryController.processQuery);
router.get('/', authMiddleware, queryController.getQueries);

router.get('/suggestions/:datasetId', authMiddleware, queryController.getSuggestions);

module.exports = router;

