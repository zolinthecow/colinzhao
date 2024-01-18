import { Express, Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { ulid } from 'ulid';

import serviceCollection from '@codechat/services';

import { RestTypes } from './types';

const setStreamChatResponse = (app: Express) =>
  app.post(
    '/stream-chat-response',
    // eslint-disable-next-line
    expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { content } = req.body as RestTypes['stream-chat-response']['request']['body'];

      const userMessageId = ulid();
      const userResp: RestTypes['stream-chat-response']['response'] = {
        type: 'USER',
        id: userMessageId,
        message: content,
      };
      res.write(JSON.stringify(userResp));

      const stream = await serviceCollection.aiService.getOpenAIClient().chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content }],
        stream: true,
      });

      const aiMessageId = ulid();

      for await (const chunk of stream) {
        const aiResponse = chunk.choices[0]?.delta?.content || '';
        if (aiResponse === '') continue;

        const aiResp: RestTypes['stream-chat-response']['response'] = {
          type: 'AI',
          id: aiMessageId,
          message: aiResponse,
        };

        res.write(JSON.stringify(aiResp));
      }

      res.end();
    })
  );

export default setStreamChatResponse;
