// backend/meilisearch.js
import dotenv from "dotenv";
import { MeiliSearch } from "meilisearch";

dotenv.config();

export const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY,
});
