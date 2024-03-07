import {
  AfterCallbackAppRoute,
  handleAuth,
  handleCallback,
} from '@auth0/nextjs-auth0';

import UserService from '@colinzhao/lib/UserService';

const afterCallback: AfterCallbackAppRoute = async (req, session, state) => {
  const { user } = session;

  if (user) {
    console.log(user);
    await UserService.createUserIfNotExisting({
      id: user.sub,
      nickname: user.nickname,
      picture: user.picture,
    });
  }

  return session;
};
export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
