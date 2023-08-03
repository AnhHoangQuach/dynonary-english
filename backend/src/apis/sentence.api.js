const sentenceApi = require('express').Router();
const sentenceController = require('../controllers/sentence.controller');
const roleMiddleware = require('../middlewares/role.middleware');

sentenceApi.post(
  '/contribute/add-sentence',
  sentenceController.postContributeSentence,
);

sentenceApi.get('/total', sentenceController.getTotalSentences);

sentenceApi.get('/list', sentenceController.getSentenceList);

sentenceApi.put(
  '/:id',
  roleMiddleware.hasRole(['ADMIN']),
  sentenceController.approveSentence,
);

sentenceApi.get(
  '/sentences-list',
  roleMiddleware.hasRole(['ADMIN']),
  sentenceController.fetchSentences,
);

module.exports = sentenceApi;
