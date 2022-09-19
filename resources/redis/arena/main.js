const Arena = require('bull-arena');
const Bull = require('bull');

const HTTP_SERVER_PORT = 4735;
const REDIS_SERVER_PORT = 6379;

async function main() {
  return Arena(
    {
      Bull,
      queues: [{ name: 'profile', hostId: 'coin-monitor' }].map((queue) => ({
        ...queue,

        // Queue type (Bull or Bee - default Bull).
        type: 'queue',

        redis: {
          host: 'cm-redis',
          port: REDIS_SERVER_PORT,
        },
      })),
    },
    {
      port: HTTP_SERVER_PORT,
    },
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
