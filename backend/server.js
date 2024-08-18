/* eslint-disable jest/require-hook */
import { server } from './socketServer';

const { PORT } = process.env || 1234;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
