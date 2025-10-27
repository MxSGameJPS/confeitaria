"use client";
import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    // login seguro: envia email e senha para o backend
    if (form.email && form.password) {
      const res = await fetch("/api/clients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (res.ok) {
        const client = await res.json();
        localStorage.setItem("client_email", client.email);
        localStorage.setItem("client_id", client.id);
        localStorage.setItem("client_name", client.full_name);
        console.log("Login realizado, id salvo:", client.id);
        router.push("/loja");
      } else {
        setErr("Email ou senha inválidos");
      }
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Login</h1>
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
          {err && <p className={styles.error}>{err}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
