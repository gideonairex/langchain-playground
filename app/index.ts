import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
// import { Document } from "langchain/document";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
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

const model = new OpenAI();
const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
  k: 1,
  returnSourceDocuments: true,
});
const response = await chain.call({ query: "Who gave Adrian Caseys reviews?" });
console.log(response.text);

})();