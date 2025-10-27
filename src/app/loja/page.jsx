"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./loja.module.css";

export default function Loja() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Loja - Cardápio</h1>
        {loading ? (
          <div className={styles.empty}>
            <p>Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <p>EM BREVE SUAS DELÍCIAS APARECERÃO AQUI</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
