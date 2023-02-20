import {
  CollectionOptions,
  Db,
  DbOptions,
  ListCollectionsOptions,
  MongoClient,
  MongoClientOptions,
} from "mongodb";

export class CloneFromMongoDB {
  private client: MongoClient;
  private db: Db;
  private isConnected: boolean = false;

  constructor(
    url: string,
    dbName: string,
    mongoClientOptions?: MongoClientOptions,
    dbOptions?: DbOptions,
  ) {
    this.client = new MongoClient(url, mongoClientOptions);
    this.db = this.client.db(dbName, dbOptions);
    this.client.on("connectionReady", (event) => {
      this.isConnected = true;
      console.log("CloneFromMongoDB connected!");
    });
    this.client.on("connectionClosed", (event) => {
      this.isConnected = false;
      console.log("CloneFromMongoDB disconnected!");
    });
  }

  private async connectionChecker() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async getCollections(options?: ListCollectionsOptions) {
    await this.connectionChecker();
    return this.db.collections(options);
  }

  async getCollection(name: string, options?: CollectionOptions) {
    await this.connectionChecker();
    return this.db.collection(name, options);
  }

  close(force?: boolean) {
    // await this.connectionChecker();
    this.client.close(force);
  }
}
