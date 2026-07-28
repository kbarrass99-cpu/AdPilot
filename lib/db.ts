import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

// Lazy db: neon() is NEVER called at module load (which happens during Next.js
// "Collecting page data" at build time). It initializes on the first real query
// at request time, when NEON_DATABASE_URL is present. This keeps the build green
// even if the env var is missing or malformed.
let _db: ReturnType<typeof drizzle> | null = null;
function instance() {
  if (!_db) _db = drizzle(neon(process.env.NEON_DATABASE_URL!));
  return _db;
}
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_t, prop) {
    const inst = instance() as any;
    const val = inst[prop];
    return typeof val === "function" ? val.bind(inst) : val;
  },
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  org_id: text("org_id").notNull(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  bullets: text("bullets"),
});

export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  org_id: text("org_id").notNull(),
  product_url: text("product_url").notNull(),
  style: text("style").notNull(),
  hook: text("hook").notNull(),
  script: text("script").notNull(),
  caption: text("caption").notNull(),
  hashtags: text("hashtags").notNull(),
  score: real("score").notNull(),
  ts: timestamp("ts").defaultNow(),
});

export const orgs = pgTable("orgs", {
  id: serial("id").primaryKey(),
  clerk_org_id: text("clerk_org_id").notNull(),
  plan: text("plan").default("starter").notNull(),
});
