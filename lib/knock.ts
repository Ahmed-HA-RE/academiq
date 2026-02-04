import Knock from '@knocklabs/node';

const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

export default knock;
