import { createApp } from './app.js';

const port = process.env.PORT ?? '3000';
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exitCode = 1;
} else {
  const server = createApp();
  server.on('error', (error) => {
    console.error('Failed to start backend:', error);
    process.exitCode = 1;
  });
  server.listen(Number(port), () => {
    console.log(`Backend listening on port ${port}`);
  });
}
