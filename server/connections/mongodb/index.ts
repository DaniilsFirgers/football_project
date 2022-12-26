import { MongoClient } from "mongodb";

async function getMongoDb() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const db = client.db("project_md");

  return db;
}
export default getMongoDb;
