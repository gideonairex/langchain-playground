import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

dotenv.config();

(async () => {

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX!);
const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex }
);

const results = await vectorStore.similaritySearch("What's ADrian Caseys current job?");

console.log(results);

})();