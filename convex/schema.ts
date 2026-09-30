import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  content: defineTable({
    sectionId: v.optional(v.string()), // e.g. 'hero', 'about', 'sponsors'
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
    capacity: v.optional(v.number()), // Max kapacita turnusu
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
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("admin"), v.literal("coach"), v.literal("parent"))),
  }).index("email", ["email"])
    .index("phone", ["phone"]),
  
  children: defineTable({
    parentId: v.id("users"),
    name: v.string(),
    birthDate: v.string(),
    club: v.optional(v.string()),
    healthInfo: v.optional(v.string()),
    tshirtSize: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_parent", ["parentId"]),

  evaluations: defineTable({
    childId: v.id("children"),
    campId: v.string(),
    coachId: v.id("users"),
    pointsBehavior: v.number(), // Hodnocení chování (např. 0-10)
    pointsFriends: v.number(), // Přístup ke kamarádům
    pointsCompetitions: v.number(), // Hodnocení v soutěžích
    notes: v.optional(v.string()), // Slovní hodnocení
    createdAt: v.number(),
  })
    .index("by_child", ["childId"])
    .index("by_camp", ["campId"])
    .index("by_coach", ["coachId"]),

  sponsors: defineTable({
    name: v.string(),
    logo: v.string(), // URL to the image
    level: v.string(), // 'main' | 'partner'
    order: v.optional(v.number()),
    createdAt: v.number(),
  }),
  registrations: defineTable({
    userId: v.optional(v.id("users")), // Pro navázání na rodiče (nové přihlášky)
    childId: v.optional(v.id("children")), // Pro navázání na profil dítěte
    assignedCoachId: v.optional(v.id("users")), // ID trenéra, kterému bylo dítě přiděleno
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
