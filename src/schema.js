const {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  decimal
} = require("drizzle-orm/pg-core");


const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),

  userName: text("username")
    .notNull()
    .unique(),

  passwordHash: text("password_hash")
    .notNull(),
});


const serviceInquiries = pgTable("service_inquiries", {
  id: serial("id").primaryKey(),

  name: text("name")
    .notNull(),

  email: text("email")
    .notNull(),

  phone: text("phone"),

  company: text("company"),

  message: text("message")
    .notNull(),

  serviceType: varchar("service_type", {
    length: 100
  }).notNull(),

  date: timestamp("date")
    .defaultNow(),
});


const estimates = pgTable("estimates", {
  id: serial("id")
    .primaryKey(),

  name: varchar("name", {
    length: 255
  }).notNull(),

  email: varchar("email", {
    length: 255
  }).notNull(),

  phone: varchar("phone", {
    length: 50
  }),

  itemsSelected: text("items_selected")
    .notNull(),

  totalPrice: decimal("total_price", {
    precision: 10,
    scale: 2
  }).notNull(),

  date: timestamp("date")
    .defaultNow(),
});


module.exports = {
  adminUsers,
  serviceInquiries,
  estimates
};