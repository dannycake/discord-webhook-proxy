import { Elysia, t } from 'elysia';
import { helmet } from 'elysia-helmet';
import { swagger } from '@elysiajs/swagger';
import { WebhookBody } from './types';
import discord from './discord';

const API_KEY = process.env.API_KEY!;

const app = new Elysia({
  prefix: '/api',
})
  .use(helmet())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Webhook Shit (tap in)',
          version: '0.0.0',
        },
      },
    })
  )
  .get(
    '/stats',
    ({}) => {
      const stats = discord.stats;
      const queue = discord.queue.length;

      return {
        success: true,
        queue,
        stats,
      };
    },
    {
      detail: {
        summary: 'Queue Stats',
        description: 'Returns session queue stats',
        responses: {
          '200': {
            description: `Successful query of server stats`,
          },
        },
      },
    }
  )
  .post(
    '/webhooks/:id/:secret',
    ({ body, headers, set, params }) => {
      if (headers.authorization !== API_KEY) {
        set.status = 401;
        return {
          error: true,
          message: 'Invalid authorization provided.',
        };
      }

      discord.queue.add({
        url: `https://discord.com/api/webhooks/${params.id}/${params.secret}`,
        body,
      });

      return {
        success: true,
      };
    },
    {
      headers: t.Object({
        authorization: t.String({
          description: 'Your API key',
        }),
      }),
      params: t.Object({
        id: t.String(),
        secret: t.String(),
      }),
      body: WebhookBody,
      detail: {
        summary: 'Send Webhook Message',
        description: 'Sends a raw Discord webhook message',
        responses: {
          '200': {
            description: 'Successfully queued message',
          },
          '401': {
            description: 'Invalid authorization',
          },
        },
      },
    }
  )
  .patch(
    '/clear',
    ({ headers, set }) => {
      if (headers.authorization !== API_KEY) {
        set.status = 401;
        return {
          error: true,
          message: 'Invalid authorization provided.',
        };
      }

      discord.queue.clear();

      return {
        success: true,
      };
    },
    {
      headers: t.Object({
        authorization: t.String({
          description: 'Your API key',
        }),
      }),
      detail: {
        summary: 'Clear Queue',
        description: 'Clears the entire queue',
        responses: {
          '200': {
            description: 'Successfully cleared everything',
          },
          '401': {
            description: 'Invalid authorization',
          },
        },
      },
    }
  );

const start = () => {
  app.listen(3000);
};

export type App = typeof app;
export default {
  start,
};
