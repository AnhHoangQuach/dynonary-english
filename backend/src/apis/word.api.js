const wordApi = require('express').Router();
const wordController = require('../controllers/word.controller');
const { jwtAuthentication } = require('../middlewares/passport.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

wordApi.post('/contribute/add-word', wordController.postContributeWord);

wordApi.get('/exist', wordController.getCheckWordExistence);
wordApi.get('/pack', wordController.getWordPack);
wordApi.get('/search-word', wordController.getSearchWord);
wordApi.get('/word-details', wordController.getWordDetails);
wordApi.get(
  '/favorite-list',
  jwtAuthentication,
  wordController.getUserFavoriteList,
);
wordApi.put(
  '/:id',
  roleMiddleware.hasRole(['ADMIN']),
  wordController.approveWord,
);

wordApi.get(
  '/words-list',
  roleMiddleware.hasRole(['ADMIN']),
  wordController.fetchWords,
);

module.exports = wordApi;
