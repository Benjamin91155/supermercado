const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Cargamos variables desde .env si existe (para entornos locales).
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    if (!key) continue;
    const value = rest.join("=").trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  // Mostramos mensaje claro si falta la conexion.
  console.error("MONGODB_URI no esta definida. Revisa tu archivo .env.");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  await mongoose.connect(mongoUri, { dbName: "supermercado_el_negro" });

  const email = "novena097@gmail.com";
  const password = "benlau02";
  const name = "Novena Admin";

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    await existing.save();
    console.log("Admin actualizado:", email);
  } else {
    await User.create({ name, email, passwordHash, role: "admin" });
    console.log("Admin creado:", email);
  }

  await mongoose.disconnect();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error al crear admin:", error);
    process.exit(1);
  });