"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./acesso.module.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const router = useRouter();

  function submit(e) {
    e.preventDefault();
    // credenciais pré definidas
    if (
      form.email === "confeiteira@admin.com" &&
      form.password === "Confeiteira123"
    ) {
      sessionStorage.setItem("admin_logged", "1");
      router.push("/confeiteira/dashboard");
    } else {
      setErr("Credenciais inválidas");
    }
  }

  return (
    <main className={styles.container}>
      <h1>Acesso Confeiteira</h1>
      <form onSubmit={submit} className={styles.form}>
        <label>
          Email
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button type="submit">Entrar</button>
        {err && <p className={styles.err}>{err}</p>}
      </form>
    </main>
  );
}
