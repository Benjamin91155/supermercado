"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      router.push("/");
    } catch (requestError: unknown) {
      const fallback = "No pudimos crear la cuenta.";
      if (typeof requestError === "object" && requestError && "message" in requestError) {
        setError(String(requestError.message));
      } else {
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <Card className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Crear cuenta</h1>
          <p className="text-sm text-slate-600">
            Registrate para guardar tu historial y comprar mas rapido.
          </p>
        </div>
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Contrasena"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? (
          <Card className="border-brand-red/30 bg-brand-red/5 text-sm text-brand-red">
            {error}
          </Card>
        ) : null}
        <Button size="lg" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </Button>
        <p className="text-sm text-slate-600">
          Ya tenes cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand-blue">
            Ingresar
          </Link>
        </p>
      </Card>
    </main>
  );
}