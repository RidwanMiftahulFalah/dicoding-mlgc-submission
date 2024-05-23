require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const ClientError = require('../exceptions/ClientError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;

    if (response.isBoom) {
      let customMessage;

      if (response.output.statusCode === 413) {
        customMessage =
          'Payload content length greater than maximum allowed: 1000000';
      } else if (response.output.statusCode === 400) {
        customMessage = 'Terjadi kesalahan dalam melakukan prediksi';
      }

      const newResponse = h.response({
        status: 'fail',
        message: customMessage,
      });

      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
