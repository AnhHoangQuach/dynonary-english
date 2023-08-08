const { addTopicsQuery } = require('../helper/word-pack.helper');
const SentenceModel = require('../models/sentence.model');
const mongoose = require('mongoose');

exports.createSentence = async (sentence, mean, note, topics) => {
  try {
    const result = SentenceModel.create({ sentence, mean, note, topics });
    if (result) return true;
    return false;
  } catch (error) {
    throw error;
  }
};

exports.getTotalSentences = async (topics = []) => {
  try {
    let query = {};

    // query multiple topic
    addTopicsQuery(topics, query);

    const total = await SentenceModel.countDocuments(query);
    return total;
  } catch (error) {
    throw error;
  }
};

exports.getSentenceList = async (page = 1, perPage = 20, topics = []) => {
  try {
    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    let query = {};
    // query multiple topic
    addTopicsQuery(topics, query);

    const list = await SentenceModel.find(query)
      .skip(skip)
      .limit(perPageInt)
      .select('-_id -isChecked -topics');

    return list;
  } catch (error) {
    throw error;
  }
};

exports.approveSentence = async (id) => {
  try {
    const isUpdated = await SentenceModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isChecked: true },
    );
    if (isUpdated.n && isUpdated.ok) {
      return { status: true, message: 'success' };
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.fetchSentences = async (page = 1, perPage = 20, search = '') => {
  try {
    const sentences = await SentenceModel.find({
      sentence: { $regex: search, $options: 'i' },
      isChecked: false,
    })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return sentences;
  } catch (error) {
    throw error;
  }
};
