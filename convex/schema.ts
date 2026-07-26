import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  content: defineTable({
    sectionId: v.string(), // e.g. 'hero', 'about', 'sponsors'
    fields: v.array(v.object({
      key: v.string(),
      value: v.union(v.string(), v.number()),
      label: v.string(),
      type: v.string(), // 'text', 'textarea', 'number'
    })),
  }).index("by_section", ["sectionId"]),
  gallery: defineTable({
    url: v.string(),
    publicId: v.string(),
    alt: v.optional(v.string()),
    createdAt: v.number(),
  }),
  news: defineTable({
    title: v.string(),
    date: v.string(),
    content: v.string(),
    active: v.boolean(),
    type: v.string(),
    createdAt: v.number(),
  }),
  camps: defineTable({
    dates: v.string(),
    location: v.string(),
    price: v.string(),
    status: v.string(),
    features: v.array(v.string()),
    createdAt: v.number(),
  }),
  settings: defineTable({
    cloudinaryCloudName: v.optional(v.string()),
    cloudinaryUploadPreset: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  }),
  team: defineTable({
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    img: v.string(), // URL
    gender: v.string(), // 'male' | 'female'
    order: v.optional(v.number()),
    createdAt: v.number(),
  }),
  stats: defineTable({
    year: v.number(),
    turnuses: v.array(v.object({
      id: v.string(),
      turnusId: v.number(),
      name: v.string(),
      boys: v.number(),
      girls: v.number(),
      price: v.number(),
      expenses: v.number(),
      note: v.string(),
    })),
    createdAt: v.number(),
  }),
  sponsors: defineTable({
    name: v.string(),
    logo: v.string(), // URL to the image
    level: v.string(), // 'main' | 'partner'
    order: v.optional(v.number()),
    createdAt: v.number(),
  }),
  registrations: defineTable({
    campId: v.string(), // The ID of the term
    campName: v.string(),
    campDates: v.string(),
    parentName: v.string(),
    parentEmail: v.string(),
    parentPhone: v.string(),
    childName: v.string(),
    childBirthDate: v.string(),
    childClub: v.optional(v.string()),
    tshirtSize: v.optional(v.string()),
    healthInfo: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(), // e.g. 'Nová', 'Schválená', 'Zamítnutá'
    createdAt: v.number(),
  }),
});
