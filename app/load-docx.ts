import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

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

const loader = new DocxLoader(
  "assets/adrian.docx"
);

const docs = await loader.load();
console.log(docs)
await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex,
});
const results = await vectorStore.similaritySearch("Who is Adrian Casey?");

console.log(results);

})();