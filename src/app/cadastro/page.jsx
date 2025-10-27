"use client";
import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./cadastro.module.css";

export default function Cadastro() {
  const [form, setForm] = useState({
    full_name: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    reference: "",
    whatsapp: "",
    email: "",
    password: "",
  });
  const [ok, setOk] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) setOk(true);
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Cadastro</h1>
        {ok ? (
          <p>Cadastro efetuado com sucesso!</p>
        ) : (
          <form onSubmit={submit} className={styles.form}>
            <label>
              Nome Completo
              <input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                required
              />
            </label>
            <label>
              CEP
              <input
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
                required
                maxLength={9}
                placeholder="00000-000"
              />
            </label>
            <label>
              Nome da Rua/Av
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                required
              />
            </label>
            <label>
              Número
              <input
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                required
              />
            </label>
            <label>
              Complemento
              <input
                value={form.complement}
                onChange={(e) =>
                  setForm({ ...form, complement: e.target.value })
                }
                placeholder="Apartamento, bloco, etc."
              />
            </label>
            <label>
              Ponto de Referência
              <input
                value={form.reference}
                onChange={(e) =>
                  setForm({ ...form, reference: e.target.value })
                }
                placeholder="Próximo a..."
              />
            </label>
            <label>
              WhatsApp
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                required
              />
            </label>
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
                minLength={6}
                placeholder="Escolha uma senha"
              />
            </label>
            <button type="submit">Cadastrar</button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
