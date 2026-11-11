import { boolean, integer, pgTable, primaryKey, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

const ts = (name: string) => timestamp(name, { withTimezone: true });

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  country: text("country").notNull().default("CR"),
  color: text("color").notNull().default("#c8f169"),
  icon: text("icon").notNull().default("coffee"),
  stampsRequired: integer("stamps_required").notNull().default(10),
  rewardText: text("reward_text").notNull(),
  pinHash: text("pin_hash").notNull(),
  walletTemplateId: text("wallet_template_id"),
  /** Huella del código con el que entra el dueño del negocio. */
  accessHash: text("access_hash").unique(),
  createdAt: ts("created_at").notNull().defaultNow(),
});

export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    code: text("code").notNull().unique(),
    token: text("token").notNull().unique(),
    stamps: integer("stamps").notNull().default(0),
    rewardsAvailable: integer("rewards_available").notNull().default(0),
    totalStamps: integer("total_stamps").notNull().default(0),
    walletInstanceId: text("wallet_instance_id"),
    walletUrl: text("wallet_url"),
    consentAt: ts("consent_at").notNull().defaultNow(),
    lastStampAt: ts("last_stamp_at"),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [unique().on(t.businessId, t.phone)],
);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  expiresAt: ts("expires_at"),
  active: boolean("active").notNull().default(true),
  createdAt: ts("created_at").notNull().defaultNow(),
});

export const couponRedemptions = pgTable(
  "coupon_redemptions",
  {
    couponId: uuid("coupon_id").notNull().references(() => coupons.id, { onDelete: "cascade" }),
    memberId: uuid("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
    redeemedAt: ts("redeemed_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.couponId, t.memberId] })],
);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  memberId: uuid("member_id").references(() => members.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  detail: text("detail"),
  createdAt: ts("created_at").notNull().defaultNow(),
});

export type Business = typeof businesses.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
