"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./perfil.module.css";

export default function Perfil() {
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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Busca id do usuário logado
    const id =
      typeof window !== "undefined" ? localStorage.getItem("client_id") : null;
    if (!id) {
      setErr("Usuário não logado. Faça login novamente.");
      setLoading(false);
      return;
    }
    console.log("Buscando perfil do id:", id);
    fetch(`/api/clients?id=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Resposta da API /api/clients:", data);
        if (data && data.id) setForm(data);
        else setErr("Cliente não encontrado no banco de dados.");
        setLoading(false);
      })
      .catch((e) => {
        setErr("Erro ao buscar perfil: " + e?.message);
        setLoading(false);
      });
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    // Envia apenas campos editáveis (email não pode ser alterado)
    const res = await fetch("/api/clients", {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        email: undefined, // não permite alteração
      }),
    });
    if (res.ok) setOk(true);
    else setErr("Erro ao atualizar perfil");
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (err) return <div className={styles.error}>{err}</div>;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Meu Perfil</h1>
        {ok && <p className={styles.success}>Perfil atualizado com sucesso!</p>}
        {err && <p className={styles.error}>{err}</p>}
        <form onSubmit={submit} className={styles.form}>
          <label>
            Nome Completo
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, complement: e.target.value })}
              placeholder="Apartamento, bloco, etc."
            />
          </label>
          <label>
            Ponto de Referência
            <input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
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
            <input value={form.email} disabled />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              placeholder="Nova senha (opcional)"
            />
          </label>
          <button type="submit">Salvar Alterações</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
