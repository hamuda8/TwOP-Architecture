const fastify = require('fastify')({ logger: true });
const path = require('path');

fastify.register(require('@fastify/static'), { root: './public' });

fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Fastify API!' });
});

fastify.get('*', async (request, reply) => {
  reply.sendFile('index.html');
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log('Fastify server running on http://localhost:3000');
});