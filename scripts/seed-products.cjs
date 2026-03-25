const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

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

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const createSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const categorySeed = [
  {
    name: "Verduleria",
    description: "Frutas y verduras frescas todos los dias.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Carniceria",
    description: "Cortes seleccionados y listos para cocinar.",
    imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798dce?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Lacteos",
    description: "Leches, quesos y yogures para toda la familia.",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Almacen",
    description: "Basicos de despensa para la semana.",
    imageUrl: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Bebidas",
    description: "Aguas, jugos y gaseosas bien frias.",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Panaderia",
    description: "Panificados recien horneados.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Limpieza",
    description: "Todo para mantener tu hogar impecable.",
    imageUrl: "https://images.unsplash.com/photo-1581579186913-45ac0f1c72b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Congelados",
    description: "Productos listos para freezar y cocinar rapido.",
    imageUrl: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=800&q=80"
  }
];

const productSeed = [
  {
    name: "Tomate perita",
    price: 1200,
    stock: 80,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1546470427-e9e5f8c0833a?auto=format&fit=crop&w=800&q=80",
    description: "Tomates firmes, ideales para salsas y ensaladas.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Papa blanca",
    price: 980,
    stock: 120,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
    description: "Papa blanca seleccionada para guisos y frituras.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Cebolla morada",
    price: 850,
    stock: 90,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1582515073490-dc07e41f07b6?auto=format&fit=crop&w=800&q=80",
    description: "Cebollas moradas frescas y de sabor suave.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Lechuga mantecosa",
    price: 700,
    stock: 60,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    description: "Hojas tiernas para ensaladas bien frescas.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Manzana roja",
    price: 1500,
    stock: 75,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    description: "Manzanas dulces y jugosas para toda la familia.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Banana ecuatoriana",
    price: 1400,
    stock: 90,
    category: "Verduleria",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    description: "Bananas maduras listas para consumir.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Carne picada especial",
    price: 4500,
    stock: 40,
    category: "Carniceria",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Carne picada con bajo contenido de grasa.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Milanesa de pollo",
    price: 5200,
    stock: 35,
    category: "Carniceria",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "Filetes de pollo empanados listos para cocinar.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Chorizo criollo",
    price: 3800,
    stock: 50,
    category: "Carniceria",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Chorizos artesanales para parrilla.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Leche entera 1L",
    price: 1100,
    stock: 100,
    category: "Lacteos",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    description: "Leche entera fortificada con calcio.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Yogur natural",
    price: 950,
    stock: 70,
    category: "Lacteos",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    description: "Yogur natural cremoso sin azucar.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Queso cremoso",
    price: 2600,
    stock: 45,
    category: "Lacteos",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
    description: "Queso cremoso ideal para sandwiches.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Arroz largo fino",
    price: 1200,
    stock: 200,
    category: "Almacen",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e17b?auto=format&fit=crop&w=800&q=80",
    description: "Arroz largo fino para guarniciones y risottos.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Fideos tirabuzon",
    price: 1350,
    stock: 180,
    category: "Almacen",
    imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80",
    description: "Fideos tirabuzon de coccion rapida.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Aceite de girasol",
    price: 3200,
    stock: 90,
    category: "Almacen",
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    description: "Aceite de girasol puro 900ml.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Agua mineral sin gas",
    price: 900,
    stock: 140,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
    description: "Agua mineral sin gas 2L.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Gaseosa cola 2.25L",
    price: 2500,
    stock: 85,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80",
    description: "Gaseosa cola refrescante para compartir.",
    isFeatured: true,
    isOffer: true
  },
  {
    name: "Jugo de naranja",
    price: 1600,
    stock: 65,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80",
    description: "Jugo de naranja exprimido 1L.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Pan lactal",
    price: 1400,
    stock: 60,
    category: "Panaderia",
    imageUrl: "https://images.unsplash.com/photo-1608198093002-de9b0f63b112?auto=format&fit=crop&w=800&q=80",
    description: "Pan lactal fresco para tostadas.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Facturas surtidas",
    price: 2200,
    stock: 40,
    category: "Panaderia",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "Docena de facturas surtidas.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Detergente limon",
    price: 1100,
    stock: 100,
    category: "Limpieza",
    imageUrl: "https://images.unsplash.com/photo-1581579186913-45ac0f1c72b7?auto=format&fit=crop&w=800&q=80",
    description: "Detergente liquido con aroma a limon.",
    isFeatured: false,
    isOffer: false
  },
  {
    name: "Lavandina",
    price: 980,
    stock: 110,
    category: "Limpieza",
    imageUrl: "https://images.unsplash.com/photo-1581579186913-45ac0f1c72b7?auto=format&fit=crop&w=800&q=80",
    description: "Lavandina para limpieza profunda.",
    isFeatured: false,
    isOffer: true
  },
  {
    name: "Medallones de carne",
    price: 3800,
    stock: 55,
    category: "Congelados",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Medallones congelados listos para cocinar.",
    isFeatured: true,
    isOffer: false
  },
  {
    name: "Papas fritas congeladas",
    price: 2600,
    stock: 70,
    category: "Congelados",
    imageUrl: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=800&q=80",
    description: "Papas listas para horno o freidora.",
    isFeatured: false,
    isOffer: false
  }
];

async function seedProducts() {
  await mongoose.connect(mongoUri, { dbName: "supermercado_el_negro" });

  const categoryMap = new Map();

  for (const category of categorySeed) {
    const slug = createSlug(category.name);
    const existing = await Category.findOne({ slug });

    if (existing) {
      existing.name = category.name;
      existing.description = category.description;
      existing.imageUrl = category.imageUrl;
      await existing.save();
      categoryMap.set(category.name, existing._id);
    } else {
      const created = await Category.create({
        name: category.name,
        slug,
        description: category.description,
        imageUrl: category.imageUrl
      });
      categoryMap.set(category.name, created._id);
    }
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const product of productSeed) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) continue;

    const existing = await Product.findOne({ name: product.name });
    if (existing) {
      existing.price = product.price;
      existing.stock = product.stock;
      existing.category = categoryId;
      existing.imageUrl = product.imageUrl;
      existing.description = product.description;
      existing.isFeatured = product.isFeatured;
      existing.isOffer = product.isOffer;
      await existing.save();
      updatedCount += 1;
    } else {
      await Product.create({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: categoryId,
        imageUrl: product.imageUrl,
        description: product.description,
        isFeatured: product.isFeatured,
        isOffer: product.isOffer
      });
      createdCount += 1;
    }
  }

  console.log(`Categorias listas: ${categorySeed.length}`);
  console.log(`Productos creados: ${createdCount}`);
  console.log(`Productos actualizados: ${updatedCount}`);

  await mongoose.disconnect();
}

seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error al cargar productos:", error);
    process.exit(1);
  });
