const { MongoClient } = require("mongodb");

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri =
    "mongodb+srv://spekterbangla:bPbpqQtXGUh8sQc2@cluster0.ujhky.mongodb.net/cloudbreak-prod?retryWrites=true&w=majority";
  const uri2 = "mongodb://127.0.0.1:27017/cloudbreak-dev";

  const client = new MongoClient(uri);
  const client2 = new MongoClient(uri2);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    await client2.connect();
    const db = client.db("cloudbreak-prod");
    const db2 = client2.db("cloudbreak-dev");

    const tables = await db.collections({ nameOnly: true });
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const collectionName = table.collectionName;
      if (collectionName == "system.indexes") {
        continue;
      }

      const docs = await table.find({}).toArray();

      if (docs.length > 0) {
        const table2 = db2.collection(collectionName);
        await table2.deleteMany({});
        console.log(`inserting into ${collectionName}`);
        await table2.insertMany(docs);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    await client2.close();
  }
}

main().catch(console.error);
