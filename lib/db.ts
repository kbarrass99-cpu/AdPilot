import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.NEON_DATABASE_URL!);
export const db = drizzle(sql);

export const variants = {
  id: "serial primary key",
  org_id: "text not null",
  product_url: "text not null",
  style: "text not null",          // ugc | problem_solution | listicle | founder
  hook: "text not null",
  script: "text not null",
  caption: "text not null",
  hashtags: "text not null",
  score: "numeric(3,1) not null",  // 0-10 hook strength
  ts: "timestamptz default now()",
} as const;

export const products = {
  id: "serial primary key",
  org_id: "text not null",
  url: "text not null",
  title: "text not null",
  bullets: "text",
} as const;

export const orgs = {
  id: "serial primary key",
  clerk_org_id: "text not null",
  plan: "text not null default 'starter'",
} as const;
