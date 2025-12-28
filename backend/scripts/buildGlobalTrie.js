import fs from "fs";
import { Trie } from "../utils/Trie.js";
import { tokenize } from "../utils/tokenize.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths for input and output files
const inputPath = path.join(__dirname, "../data/globalchats.txt");
const outputPath = path.join(__dirname, "../data/globalTrie.json");

// Load dataset
const text = fs.readFileSync(inputPath, "utf-8");

const trie = new Trie();

// Spliting into lines/sentences
const sentences = text.split("\n");

for (const sentence of sentences) {
  const tokens = tokenize(sentence);
  if (tokens.length > 0) {
    trie.insert(tokens);
  }
}

// Save serialized trie
fs.writeFileSync(outputPath, JSON.stringify(trie.serialize(), null, 2));

console.log("Global Trie built successfully at:", outputPath);
