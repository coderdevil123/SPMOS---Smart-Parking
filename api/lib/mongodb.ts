import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Cache the connection across invocations (serverless friendly)
declare global {
  // eslint-disable-next-line no-var
  var _mongooseGlobal: any;
}
const globalAny: any = global;

if (!globalAny._mongooseGlobal) {
  globalAny._mongooseGlobal = { conn: null, promise: null };
}

async function dbConnect() {
  if (globalAny._mongooseGlobal.conn) {
    return globalAny._mongooseGlobal.conn;
  }
  if (!globalAny._mongooseGlobal.promise) {
    globalAny._mongooseGlobal.promise = mongoose
      .connect(MONGODB_URI, {
        // @ts-ignore
        useNewUrlParser: true,
        // @ts-ignore
        useUnifiedTopology: true,
      })
      .then((m) => m);
  }
  globalAny._mongooseGlobal.conn = await globalAny._mongooseGlobal.promise;
  return globalAny._mongooseGlobal.conn;
}

export default dbConnect;
