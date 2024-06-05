const { MongoClient } = require("mongodb");

async function clone(from, to) {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const fromClient = new MongoClient(from.uri);
  const toClient = new MongoClient(to.uri);

  try {
    // Connect to the MongoDB cluster
    await fromClient.connect();
    await toClient.connect();
    const fromDb = fromClient.db(from.db);
    const toDb = toClient.db(to.db);

    const fromTables = await fromDb.collections({ nameOnly: true });
    for (let i = 0; i < fromTables.length; i++) {
      const fromTable = fromTables[i];
      const collectionName = fromTable.collectionName;
      if (collectionName == "system.indexes") {
        continue;
      }

      const docs = await fromTable.find({}).toArray();

      if (docs.length > 0) {
        const toTable = toDb.collection(collectionName);
        await toTable.deleteMany({});
        console.log(`inserting into ${collectionName}`);
        await toTable.insertMany(docs);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await fromClient.close();
    await toClient.close();
  }
}

clone(
  {
    uri: "mongodb+srv://spekterbangla:*********@cluster0.ujhky.mongodb.net/?retryWrites=true&w=majority",
    db: "atlashub-prod-clone",
  },
  {
    uri: "mongodb+srv://dev:*****@testcluster.qhiapda.mongodb.net/?retryWrites=true&w=majority",
    db: "atlashub-dev",
  },
).catch(console.error);
