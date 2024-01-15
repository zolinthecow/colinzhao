export type RestTypes = {
  'stream-chat-response': {
    request: {
      body: {
        content: string;
      },
    },
    response: {
      type: 'AI' | 'USER',
      id: string;
      message: string;
    },
  },
  'UNKNOWN': {
    request: 'UNKNOWN';
    response: 'UNKNOWN';
  },
};
