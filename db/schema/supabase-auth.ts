import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// User profiles table that references Supabase auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // This should match auth.users.id from Supabase
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Example table for user-specific data with RLS
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(), // References profiles.id
  title: text("title").notNull(),
  content: text("content"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Example table for public data that users can read but only own
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(), // References profiles.id
  task: text("task").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
