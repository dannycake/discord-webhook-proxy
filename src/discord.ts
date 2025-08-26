import { AsyncQueue } from './queue';
import superagent from 'superagent';
import logger from './logger';

interface QueueItem {
  url: string;
  body: any;
}

const stats = {
  attempts: 0,
  sent: 0,
  errored: 0,
};

const agent = superagent.agent().set('content-type', 'application/json');
const process = async (item: QueueItem): Promise<void> => {
  while (true) {
    stats.attempts++;

    try {
      const response = await agent.post(item.url).send(item.body);
      logger.info(
        `Successfully sent a webhook message to ${item.url} (${response.status})`
      );

      stats.sent++;

      return;
    } catch (error: any) {
      const { status, response } = error;

      if (status === 429 || status >= 500) {
        logger.debug(
          `Ratelimited while sending a message to ${item.url} (${status})`
        );
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
        continue;
      }

      stats.errored++;

      logger.error(
        `Failed to send a webhook message to ${item.url} (${status}):`,
        error?.response?.body || error
      );
      return;
    }
  }
};

const queue = new AsyncQueue<QueueItem>('Send Queue', process);

export default {
  queue,
  get stats() {
    return stats;
  },
};
