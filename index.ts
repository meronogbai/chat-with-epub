import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { loadQAStuffChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "node:fs";
import mime from "mime";

const pathToEpub = process.argv[2];

if (!pathToEpub || !fs.existsSync(pathToEpub)) {
  console.error("File doesn't exist");
  process.exit(1);
}

const isFileAValidEpub = mime.getType(pathToEpub) === "application/epub+zip";

if (!isFileAValidEpub) {
  console.error("Input file is not a valid epub");
  process.exit(1);
}

console.log("Langchain is loading the data...");

const loader = new EPubLoader(pathToEpub);
const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});

const splitDocs = await textSplitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings,
);

const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

const stuffChain = loadQAStuffChain(model);

console.log("Ask your questions 🧠");

const prompt = "Q: ";
process.stdout.write(prompt);

for await (const line of console) {
  const relevantDocs = await vectorStore.similaritySearch(line);
  const result = await stuffChain.call({
    question: line,
    input_documents: relevantDocs,
  });
  console.log("A: ", result.text);
  process.stdout.write(prompt);
}
