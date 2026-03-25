
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import {
  formatBranch,
  formatCurrency,
  formatFulfillment,
  formatOrderStatus,
  formatPaymentMethod
} from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { SidePanel } from "@/components/ui/SidePanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  description?: string;
  isFeatured?: boolean;
  isOffer?: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type OrderItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type OrderUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Order = {
  id: string;
  user?: OrderUser | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
  paymentMethod: string;
  branch: string;
  fulfillment?: string;
  scheduledSlot?: string;
  deliveryAddress?: string;
  createdAt: string;
};

type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  pages: number;
};

type CategoriesResponse = {
  items: Category[];
};

type OrdersResponse = {
  items: Order[];
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  isFeatured: boolean;
  isOffer: boolean;
};

type CategoryFormState = {
  name: string;
  description: string;
  imageUrl: string;
};

const initialProductForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
  isFeatured: false,
  isOffer: false
};

const initialCategoryForm: CategoryFormState = {
  name: "",
  description: "",
  imageUrl: ""
};

const orderStatusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "shipped", label: "Enviado" },
  { value: "cancelled", label: "Cancelado" }
];

const resolveOrderId = (order: Order & { _id?: string }) => order.id ?? order._id ?? "";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { notify } = useNotifications();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(initialCategoryForm);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productEditForm, setProductEditForm] = useState<ProductFormState>(initialProductForm);
  const [categoryEditForm, setCategoryEditForm] = useState<CategoryFormState>(initialCategoryForm);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    return [
      { label: "Productos", value: products.length },
      { label: "Categorias", value: categories.length },
      { label: "Pedidos", value: orders.length },
      { label: "Pendientes", value: pendingOrders }
    ];
  }, [products, categories, orders]);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => {
      const categoryName = product.category?.name?.toLowerCase() ?? "";
      return (
        product.name.toLowerCase().includes(query) ||
        categoryName.includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });
  }, [products, productSearch]);

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categories, categorySearch]);

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;
      const matchesQuery =
        order.id.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query) ||
        order.user?.name?.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  useEffect(() => {
    if (!token || !user || user.role !== "admin") return;
    loadDashboard();
  }, [token, user]);

  useEffect(() => {
    const drafts: Record<string, string> = {};
    orders.forEach((order) => {
      const orderId = resolveOrderId(order);
      if (orderId) {
        drafts[orderId] = order.status;
      }
    });
    setOrderDrafts(drafts);
  }, [orders]);

  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const [productsData, categoriesData, ordersData] = await Promise.all([
        apiRequest<ProductsResponse>("/api/products?limit=200"),
        apiRequest<CategoriesResponse>("/api/categories"),
        apiRequest<OrdersResponse>("/api/orders", {}, token)
      ]);

      setProducts(productsData.items);
      setCategories(categoriesData.items);
      setOrders(ordersData.items);
    } catch (requestError: unknown) {
      const fallback = "No pudimos cargar el panel de administracion.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        setError(String(requestError.message));
      } else {
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!token) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await apiRequest<{ url: string }>(
        "/api/upload",
        {
          method: "POST",
          body: formData
        },
        token
      );

      setUploadedUrl(data.url);
      notify({
        title: "Imagen subida",
        message: "La imagen se cargo correctamente.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos subir la imagen.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({
          title: "Error",
          message: String(requestError.message),
          variant: "error"
        });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!token) return;
    setSavingCategory(true);

    try {
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        imageUrl: categoryForm.imageUrl
      };

      const data = await apiRequest<Category>(
        "/api/categories",
        {
          method: "POST",
          body: JSON.stringify(payload)
        },
        token
      );

      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryForm(initialCategoryForm);
      notify({
        title: "Categoria creada",
        message: "La categoria se agrego correctamente.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos crear la categoria.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!token) return;
    setSavingProduct(true);

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId,
        imageUrl: productForm.imageUrl,
        isFeatured: productForm.isFeatured,
        isOffer: productForm.isOffer
      };

      const data = await apiRequest<Product>(
        "/api/products",
        {
          method: "POST",
          body: JSON.stringify(payload)
        },
        token
      );

      setProducts((prev) => [data, ...prev]);
      setProductForm(initialProductForm);
      notify({
        title: "Producto creado",
        message: "El producto se agrego correctamente.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos crear el producto.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Eliminar el producto ${product.name}? Esta accion no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await apiRequest<{ id: string }>(`/api/products/${product.id}`, { method: "DELETE" }, token);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      notify({
        title: "Producto eliminado",
        message: "El producto fue eliminado.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos eliminar el producto.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Eliminar la categoria ${category.name}? Esta accion no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await apiRequest<{ id: string }>(`/api/categories/${category.id}`, { method: "DELETE" }, token);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      notify({
        title: "Categoria eliminada",
        message: "La categoria fue eliminada.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos eliminar la categoria.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const handleUpdateProduct = async () => {
    if (!token || !editingProduct) return;

    try {
      const payload = {
        name: productEditForm.name,
        description: productEditForm.description,
        price: Number(productEditForm.price),
        stock: Number(productEditForm.stock),
        categoryId: productEditForm.categoryId,
        imageUrl: productEditForm.imageUrl,
        isFeatured: productEditForm.isFeatured,
        isOffer: productEditForm.isOffer
      };

      const data = await apiRequest<Product>(
        `/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload)
        },
        token
      );

      setProducts((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      setEditingProduct(null);
      notify({
        title: "Producto actualizado",
        message: "Los cambios fueron guardados.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos actualizar el producto.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!token || !editingCategory) return;

    try {
      const payload = {
        name: categoryEditForm.name,
        description: categoryEditForm.description,
        imageUrl: categoryEditForm.imageUrl
      };

      const data = await apiRequest<Category>(
        `/api/categories/${editingCategory.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload)
        },
        token
      );

      setCategories((prev) =>
        prev
          .map((item) => (item.id === data.id ? data : item))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingCategory(null);
      notify({
        title: "Categoria actualizada",
        message: "Los cambios fueron guardados.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos actualizar la categoria.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        notify({ title: "Error", message: String(requestError.message), variant: "error" });
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const handleUpdateOrderStatus = async (order: Order) => {
    if (!token) return;
    const orderId = resolveOrderId(order);
    if (!orderId) {
      notify({
        title: "Error",
        message: "No encontramos el ID del pedido. Actualiza la lista.",
        variant: "error"
      });
      return;
    }
    const status = orderDrafts[orderId] ?? order.status;

    try {
      const data = await apiRequest<{ id: string; status: string }>(
        `/api/orders/${orderId}`,
        {
          method: "PUT",
          body: JSON.stringify({ status, orderId })
        },
        token
      );

      setOrders((prev) =>
        prev.map((item) =>
          resolveOrderId(item) === data.id ? { ...item, status: data.status } : item
        )
      );
      notify({
        title: "Pedido actualizado",
        message: "El estado del pedido fue actualizado.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos actualizar el pedido.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        const message = String(requestError.message);
        notify({ title: "Error", message, variant: "error" });
        if (message.toLowerCase().includes("pedido no encontrado")) {
          loadDashboard();
        }
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!token) return;
    const orderId = resolveOrderId(order);
    if (!orderId) {
      notify({
        title: "Error",
        message: "No encontramos el ID del pedido. Actualiza la lista.",
        variant: "error"
      });
      return;
    }
    const confirmed = window.confirm(
      `Eliminar el pedido #${orderId.slice(-6)}? Esta accion no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await apiRequest<{ id: string }>(
        `/api/orders/${orderId}`,
        { method: "DELETE", body: JSON.stringify({ orderId }) },
        token
      );
      setOrders((prev) => prev.filter((item) => resolveOrderId(item) !== orderId));
      notify({
        title: "Pedido eliminado",
        message: "El pedido fue eliminado.",
        variant: "success"
      });
    } catch (requestError: unknown) {
      const fallback = "No pudimos eliminar el pedido.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        const message = String(requestError.message);
        notify({ title: "Error", message, variant: "error" });
        if (message.toLowerCase().includes("pedido no encontrado")) {
          loadDashboard();
        }
      } else {
        notify({ title: "Error", message: fallback, variant: "error" });
      }
    }
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductEditForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.category?.id ?? "",
      imageUrl: product.imageUrl ?? "",
      isFeatured: Boolean(product.isFeatured),
      isOffer: Boolean(product.isOffer)
    });
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryEditForm({
      name: category.name,
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? ""
    });
  };

  if (authLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <Skeleton className="h-16" />
        <Skeleton className="h-40" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <Card className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">Panel admin</h1>
          <p className="text-sm text-slate-600">Inicia sesion para acceder.</p>
          <Link href="/login">
            <Button>Ir a login</Button>
          </Link>
        </Card>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <Card className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">Acceso restringido</h1>
          <p className="text-sm text-slate-600">
            Solo los administradores pueden ingresar a este panel.
          </p>
          <Button variant="outline" onClick={() => router.push("/")}
          >
            Volver al inicio
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
            Panel admin
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Gestion del supermercado</h1>
          <p className="text-sm text-slate-600">
            Administra productos, categorias y pedidos en tiempo real.
          </p>
        </div>
        <Button variant="outline" onClick={loadDashboard} disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar datos"}
        </Button>
      </div>

      {error ? (
        <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
          {error}
        </Card>
      ) : null}

      <Section title="Resumen" subtitle="Indicadores principales del negocio.">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Subir imagen" subtitle="Carga imagenes para productos o categorias.">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              className="text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleUpload(file);
                }
              }}
            />
            <Button variant="outline" disabled={uploading}>
              {uploading ? "Subiendo..." : "Subir imagen"}
            </Button>
          </div>
          {uploadedUrl ? (
            <div className="space-y-2 text-sm text-slate-600">
              <p>URL cargada:</p>
              <p className="break-all rounded-2xl bg-slate-100 px-4 py-3">{uploadedUrl}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProductForm((prev) => ({ ...prev, imageUrl: uploadedUrl }))}
                >
                  Usar en producto
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCategoryForm((prev) => ({ ...prev, imageUrl: uploadedUrl }))}
                >
                  Usar en categoria
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </Section>

      <Section
        title="Crear categoria"
        subtitle="Organiza el catalogo para facilitar las busquedas."
      >
        <Card className="grid gap-4 md:grid-cols-3">
          <Input
            label="Nombre"
            placeholder="Verduleria"
            value={categoryForm.name}
            onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Imagen (URL)"
            placeholder="https://"
            value={categoryForm.imageUrl}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
          />
          <Textarea
            label="Descripcion"
            placeholder="Productos frescos y seleccionados."
            value={categoryForm.description}
            onChange={(event) =>
              setCategoryForm((prev) => ({ ...prev, description: event.target.value }))
            }
          />
          <div className="md:col-span-3 flex justify-end">
            <Button onClick={handleCreateCategory} disabled={savingCategory}>
              {savingCategory ? "Guardando..." : "Crear categoria"}
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Crear producto" subtitle="Carga nuevos productos disponibles para la tienda.">
        <Card className="grid gap-4 md:grid-cols-3">
          <Input
            label="Nombre"
            placeholder="Leche descremada"
            value={productForm.name}
            onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Precio"
            type="number"
            placeholder="0"
            value={productForm.price}
            onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
          />
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            value={productForm.stock}
            onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
          />
          <Select
            label="Categoria"
            value={productForm.categoryId}
            onChange={(event) =>
              setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))
            }
          >
            <option value="">Seleccionar</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            label="Imagen (URL)"
            placeholder="https://"
            value={productForm.imageUrl}
            onChange={(event) =>
              setProductForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
          />
          <Textarea
            label="Descripcion"
            placeholder="Describe el producto."
            value={productForm.description}
            onChange={(event) =>
              setProductForm((prev) => ({ ...prev, description: event.target.value }))
            }
          />
          <div className="md:col-span-3 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={productForm.isFeatured}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, isFeatured: event.target.checked }))
                }
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={productForm.isOffer}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, isOffer: event.target.checked }))
                }
              />
              Oferta
            </label>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button onClick={handleCreateProduct} disabled={savingProduct}>
              {savingProduct ? "Guardando..." : "Crear producto"}
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Productos" subtitle="Gestiona el inventario disponible.">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Buscar producto o categoria"
            value={productSearch}
            onChange={(event) => setProductSearch(event.target.value)}
          />
        </div>
        {loading ? (
          <Skeleton className="h-40" />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="Sin productos"
            description="Crea un producto para mostrarlo en la tienda."
          />
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600">
                      {product.category?.name ?? "Sin categoria"} - Stock {product.stock}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.isOffer ? <Badge variant="red">Oferta</Badge> : null}
                    {product.isFeatured ? <Badge variant="blue">Destacado</Badge> : null}
                    <span className="text-base font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {product.description ?? "Sin descripcion"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditProduct(product)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(product)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Categorias" subtitle="Controla las categorias visibles.">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Buscar categoria"
            value={categorySearch}
            onChange={(event) => setCategorySearch(event.target.value)}
          />
        </div>
        {loading ? (
          <Skeleton className="h-32" />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            title="Sin categorias"
            description="Crea una categoria para organizar el catalogo."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{category.name}</p>
                    <p className="text-xs text-slate-500">/{category.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditCategory(category)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{category.description ?? "Sin descripcion"}</p>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title="Pedidos" subtitle="Seguimiento de compras recientes.">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Buscar por ID o cliente"
            value={orderSearch}
            onChange={(event) => setOrderSearch(event.target.value)}
          />
          <Select
            value={orderStatusFilter}
            onChange={(event) => setOrderStatusFilter(event.target.value)}
          >
            <option value="all">Todos los estados</option>
            {orderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        {loading ? (
          <Skeleton className="h-40" />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="Sin pedidos" description="Todavia no hay pedidos registrados." />
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => {
              const orderId = resolveOrderId(order);
              return (
                <Card key={orderId || order.createdAt} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Pedido #{orderId ? orderId.slice(-6) : "----"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.user?.name ?? "Cliente"} - {order.user?.email ?? ""}
                      </p>
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>Estado: {formatOrderStatus(order.status)}</span>
                    <span>Pago: {formatPaymentMethod(order.paymentMethod)}</span>
                    <span>Sucursal: {formatBranch(order.branch)}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatFulfillment(order.fulfillment)}
                    {order.scheduledSlot ? ` - ${order.scheduledSlot}` : ""}
                  </div>
                  {order.deliveryAddress ? (
                    <div className="text-xs text-slate-500">Direccion: {order.deliveryAddress}</div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      value={orderDrafts[orderId] ?? order.status}
                      disabled={!orderId}
                      onChange={(event) =>
                        setOrderDrafts((prev) => ({ ...prev, [orderId]: event.target.value }))
                      }
                    >
                      {orderStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateOrderStatus(order)}
                      disabled={!orderId}
                    >
                      Actualizar estado
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteOrder(order)}
                      disabled={!orderId}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <SidePanel
        open={Boolean(editingProduct)}
        title="Editar producto"
        onClose={() => setEditingProduct(null)}
      >
        <Input
          label="Nombre"
          value={productEditForm.name}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <Input
          label="Precio"
          type="number"
          value={productEditForm.price}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, price: event.target.value }))
          }
        />
        <Input
          label="Stock"
          type="number"
          value={productEditForm.stock}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, stock: event.target.value }))
          }
        />
        <Select
          label="Categoria"
          value={productEditForm.categoryId}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, categoryId: event.target.value }))
          }
        >
          <option value="">Seleccionar</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input
          label="Imagen (URL)"
          value={productEditForm.imageUrl}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))
          }
        />
        <Textarea
          label="Descripcion"
          value={productEditForm.description}
          onChange={(event) =>
            setProductEditForm((prev) => ({ ...prev, description: event.target.value }))
          }
        />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={productEditForm.isFeatured}
              onChange={(event) =>
                setProductEditForm((prev) => ({ ...prev, isFeatured: event.target.checked }))
              }
            />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={productEditForm.isOffer}
              onChange={(event) =>
                setProductEditForm((prev) => ({ ...prev, isOffer: event.target.checked }))
              }
            />
            Oferta
          </label>
        </div>
        <Button onClick={handleUpdateProduct}>Guardar cambios</Button>
      </SidePanel>

      <SidePanel
        open={Boolean(editingCategory)}
        title="Editar categoria"
        onClose={() => setEditingCategory(null)}
      >
        <Input
          label="Nombre"
          value={categoryEditForm.name}
          onChange={(event) =>
            setCategoryEditForm((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <Input
          label="Imagen (URL)"
          value={categoryEditForm.imageUrl}
          onChange={(event) =>
            setCategoryEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))
          }
        />
        <Textarea
          label="Descripcion"
          value={categoryEditForm.description}
          onChange={(event) =>
            setCategoryEditForm((prev) => ({ ...prev, description: event.target.value }))
          }
        />
        <Button onClick={handleUpdateCategory}>Guardar cambios</Button>
      </SidePanel>
    </main>
  );
}
