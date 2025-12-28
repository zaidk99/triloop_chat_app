import { Trie } from "../utils/Trie.js";
import Message from "../models/Messages.js";
import { tokenize } from "../utils/tokenize.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const roomTries = new Map();

let globalTrie = null;

const globalPath = path.join(__dirname, "../data/globalTrie.json");

if(fs.existsSync(globalPath)){
    try {
        const fileContent = fs.readFileSync(globalPath, "utf-8");
        if(fileContent.trim()===""){
            console.log("Global Trie file is empty - skipping");
        } else {
            const json = JSON.parse(fileContent);
            globalTrie = Trie.deserialize(json);
            roomTries.set("global",globalTrie);
            console.log("Loaded Global Trie");
        }

        
    } catch (error) {
        console.error("Error loading the global trie");
        console.log("Skipping will create new one when messges are sent ");
        
    }
} else {
    console.log("No Global Trie found - skipping ");
}

export async function loadTrie(roomId) {
  if (roomTries.has(roomId)) {
    return roomTries.get(roomId);
  }

  const messages = await Message.find({
    room: roomId,
    type: "text",
  }).select("content");

  const trie = new Trie();

  for (const msg of messages) {
    const tokens = tokenize(msg.content);
    if (tokens.length > 0) {
      trie.insert(tokens);
    }
  }

  if (globalTrie) {
    trie.merge(globalTrie);
  }

  // caching it
  roomTries.set(roomId, trie);

  return trie;
}

export async function insert(roomId, content) {
  const trie = await loadTrie(roomId);

  const tokens = tokenize(content);

  if (tokens.length > 0) {
    trie.insert(tokens);
  }

  saveRoomTrie(roomId, trie);

  if (globalTrie) {
    globalTrie.merge(trie);
    saveGlobalTrie();
  }
}

function saveRoomTrie(roomId, trie) {
  const dir = path.join(__dirname, "../data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, `trie_${roomId}.json`),
    JSON.stringify(trie.serialize(), null, 2)
  );
}

function saveGlobalTrie() {
  const dir = path.join(__dirname, "../data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, "globalTrie.json"),
    JSON.stringify(globalTrie.serialize(), null, 2)
  );
}
