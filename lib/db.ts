import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

// Defensive init: at build time NEON_DATABASE_URL may be unavailable
// (Next.js evaluates this module during "Collecting page data"). Pass a
// valid-format placeholder so neon() doesn't throw — it only connects on query.
const url = process.env.NEON_DATABASE_URL;
const sql = neon(url && url.startsWith("postgresql://") ? url : "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder");
export const db = drizzle(sql);

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
