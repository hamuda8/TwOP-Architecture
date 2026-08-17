const { Router } = require('@fastify/router');
module.exports = async function apiRouter(fastify) {
  const router = Router();
  router.get('/', async (request, reply) => {
    return { status: 'api working' };
  });
  return router;
};