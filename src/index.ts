import { CloneFromMongoDB } from "./CloneFromMongoDB";

const uri = "mongodb://127.0.0.1:27017/cloudbreak-dev";
const fromDB = new CloneFromMongoDB(uri, "iot");

const main = async () => {
  try {
    const collection = await fromDB.getCollection("test");

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await new Promise(async (res) => {
      collection.drop().then(res).catch(res);
    });

    // make a bunch of time series data
    await collection.insertMany([{ hi: "bye" }]);

    console.log("Database seeded! :)");
  } catch (err: any) {
    console.log(err);
  } finally {
    fromDB.close();
  }
};

main();
