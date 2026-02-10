import Knock, { signUserToken } from '@knocklabs/node';

const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

const signUserSecureToken = async (userId: string) => {
  return await signUserToken(userId, {
    expiresInSeconds: 60 * 60, // 1 hour
    signingKey: process.env.KNOCK_SIGNING_KEY,
  });
};

export { knock, signUserSecureToken };
