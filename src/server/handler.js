const predictClassification = require('../services/inferenceService');

const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const { label, suggestion } = await predictClassification(model, image);

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully.',
    data,
  });

  await storeData(id, data);

  response.code(201);
  return response;
}

module.exports = postPredictHandler;
