"use client";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [tab, setTab] = useState("produtos");
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  // TODO: pedidos, estoque, vendas

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged")) {
      window.location.href = "/confeiteira/acesso";
      return;
    }
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  return (
    <main className={styles.container}>
      <h1>Dashboard da Confeiteira</h1>
      <nav className={styles.tabs}>
        <button
          onClick={() => setTab("produtos")}
          className={tab === "produtos" ? styles.active : null}
        >
          Produtos
        </button>
        <button
          onClick={() => setTab("clientes")}
          className={tab === "clientes" ? styles.active : null}
        >
          Clientes
        </button>
        <button
          onClick={() => setTab("pedidos")}
          className={tab === "pedidos" ? styles.active : null}
        >
          Pedidos
        </button>
        <button
          onClick={() => setTab("estoque")}
          className={tab === "estoque" ? styles.active : null}
        >
          Estoque
        </button>
        <button
          onClick={() => setTab("balanco")}
          className={tab === "balanco" ? styles.active : null}
        >
          Balanço
        </button>
      </nav>
      {tab === "produtos" && (
        <section className={styles.section}>
          <h2>Produtos</h2>
          <form
            className={styles.productForm}
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const body = {
                name: formData.get("name"),
                price: parseFloat(formData.get("price")),
                description: formData.get("description"),
                tags: formData
                  .get("tags")
                  .split(",")
                  .map((t) => t.trim()),
                ingredients: formData
                  .get("ingredients")
                  .split(",")
                  .map((i) => i.trim()),
                promotion: formData.get("promotion") === "on",
                main_image: formData.get("main_image"),
                images: [
                  formData.get("main_image"),
                  formData.get("image2"),
                  formData.get("image3"),
                  formData.get("image4"),
                ].filter(Boolean),
              };
              const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });
              if (res.ok) {
                const novo = await res.json();
                setProducts((prev) => [...prev, novo]);
                e.target.reset();
              }
            }}
          >
            <h3>Adicionar Produto</h3>
            <label>
              Nome do produto
              <input name="name" required />
            </label>
            <label>
              Valor
              <input name="price" type="number" step="0.01" required />
            </label>
            <label>
              Descrição
              <textarea name="description" required />
            </label>
            <label>
              Tag (separadas por vírgula)
              <input name="tags" />
            </label>
            <label>
              Ingredientes (separados por vírgula)
              <input name="ingredients" />
            </label>
            <label htmlFor="promotion">
              Promoção
              <input id="promotion" name="promotion" type="checkbox" />
            </label>
            <label>
              Imagem principal (URL)
              <input name="main_image" required />
            </label>
            <label>
              Imagem 2 (URL)
              <input name="image2" />
            </label>
            <label>
              Imagem 3 (URL)
              <input name="image3" />
            </label>
            <label>
              Imagem 4 (URL)
              <input name="image4" />
            </label>
            <button type="submit">Cadastrar Produto</button>
          </form>
          <ul className={styles.productList}>
            {products.map((p) => (
              <li key={p.id} className={styles.productItem}>
                <strong>{p.name}</strong> — R${" "}
                {typeof p.price === "number"
                  ? p.price.toFixed(2)
                  : Number(p.price).toFixed(2)}
                <br />
                <span>{p.description}</span>
                <br />
                <span>
                  Tags: {Array.isArray(p.tags) ? p.tags.join(", ") : p.tags}
                </span>
                <br />
                <span>
                  Ingredientes:{" "}
                  {Array.isArray(p.ingredients)
                    ? p.ingredients.join(", ")
                    : p.ingredients}
                </span>
                <br />
                <span>Promoção: {p.promotion ? "Sim" : "Não"}</span>
                <br />
                <span>
                  Imagens:{" "}
                  {Array.isArray(p.images) ? p.images.join(", ") : p.images}
                </span>
                <br />
                <button
                  onClick={async () => {
                    if (confirm("Deseja remover este produto?")) {
                      await fetch(`/api/products?id=${p.id}`, {
                        method: "DELETE",
                      });
                      setProducts((prev) =>
                        prev.filter((prod) => prod.id !== p.id)
                      );
                    }
                  }}
                >
                  Remover
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/products?id=${p.id}`, {
                      method: "PATCH",
                    });
                    setProducts((prev) =>
                      prev.map((prod) =>
                        prod.id === p.id
                          ? { ...prod, active: !prod.active }
                          : prod
                      )
                    );
                  }}
                >
                  {p.active ? "Desativar" : "Ativar"}
                </button>
                {/* TODO: editar produto */}
              </li>
            ))}
          </ul>
        </section>
      )}
      {tab === "clientes" && (
        <section className={styles.section}>
          <h2>Clientes</h2>
          {/* TODO: mostrar todos os dados, pedidos, status */}
          <ul>
            {clients.map((c) => (
              <li key={c.id}>
                {c.full_name} — {c.email} — {c.whatsapp}
                {/* TODO: pedidos, status, editar */}
              </li>
            ))}
          </ul>
        </section>
      )}
      {tab === "pedidos" && (
        <section className={styles.section}>
          <h2>Pedidos</h2>
          {/* TODO: listar pedidos, status, confirmar/desistência */}
        </section>
      )}
      {tab === "estoque" && (
        <section className={styles.section}>
          <h2>Estoque</h2>
          {/* TODO: adicionar/remover produtos, gerar lista de compras */}
        </section>
      )}
      {tab === "balanco" && (
        <section className={styles.section}>
          <h2>Balanço de Vendas</h2>
          {/* TODO: balanço por dia, semana, mês, busca personalizada */}
        </section>
      )}
    </main>
  );
}
