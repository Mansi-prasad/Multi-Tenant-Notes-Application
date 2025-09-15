import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/user.model.js";
import Tenant from "./src/models/tenant.model.js";
import Note from "./src/models/note.model.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create tenants
    const acme = await Tenant.create({
      name: "Acme Corp",
      slug: "acme",
      plan: "free",
    });
    const globex = await Tenant.create({
      name: "Globex Inc",
      slug: "globex",
      plan: "free",
    });

    // Hash password once
    const passwordHash = await bcrypt.hash("password", 10);

    // Insert users
    await User.create([
      {
        email: "admin@acme.test",
        passwordHash,
        role: "Admin",
        tenant: acme._id,
      },
      {
        email: "user@acme.test",
        passwordHash,
        role: "Member",
        tenant: acme._id,
      },
      {
        email: "admin@globex.test",
        passwordHash,
        role: "Admin",
        tenant: globex._id,
      },
      {
        email: "user@globex.test",
        passwordHash,
        role: "Member",
        tenant: globex._id,
      },
    ]);

    console.log("Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find();
  const tenants = await Tenant.find();
  const notes = await Note.find();

  console.log('Users:', users);
  console.log('Tenants:', tenants);
  console.log('Notes:', notes);

  await mongoose.disconnect();
}

// check();
