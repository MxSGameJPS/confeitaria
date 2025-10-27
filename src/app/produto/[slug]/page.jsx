"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import styles from "./product.module.css";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        const prod = products.find((p) => p.slug === params.slug);
        if (prod) {
          prod.mainImage = prod.mainImage || prod.main_image;
          prod.prepTime = prod.prepTime || prod.prep_time || "";
          prod.price =
            typeof prod.price === "number" ? prod.price : Number(prod.price);
          prod.description = prod.description || "";
        }
        setProduct(prod || null);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [params.slug]);

  function handleAddToCart() {
    if (!product) return;
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        mainImage: product.mainImage,
        slug: product.slug,
      },
      1
    );
    setFeedback("Produto adicionado ao carrinho!");
    setTimeout(() => setFeedback(""), 1800);
  }

  return (
    <>
      <Header />
      <main>
        {loading ? (
          <p>Carregando produto...</p>
        ) : !product ? (
          <h2>Produto não encontrado</h2>
        ) : (
          <div className={styles.container}>
            <div className={styles.left}>
              <img
                src={product.mainImage}
                alt={product.name}
                className={styles.mainImage}
              />
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {product.images.map((img, idx) => (
                    <img
                      key={img}
                      src={img}
                      alt={product.name + " miniatura " + (idx + 1)}
                      className={
                        styles.thumbnail +
                        (img === product.mainImage ? " " + styles.selected : "")
                      }
                      onClick={() => setProduct({ ...product, mainImage: img })}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={styles.right}>
              <h1>{product.name}</h1>
              <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
              <p className={styles.label}>
                Tempo de preparo:
                <span style={{ fontWeight: 400 }}> {product.prepTime}</span>
              </p>
              {product.nutritional && (
                <>
                  <p className={styles.label}>Informações nutricionais:</p>
                  <ul>
                    <li>
                      Contém glúten:{" "}
                      {product.nutritional.gluten ? "Sim" : "Não"}
                    </li>
                    <li>
                      Contém lactose:{" "}
                      {product.nutritional.lactose ? "Sim" : "Não"}
                    </li>
                  </ul>
                </>
              )}
              <p style={{ marginTop: 16 }}>{product.description}</p>
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <button className={styles.button} onClick={handleAddToCart}>
                  Adicionar ao carrinho
                </button>
                <button
                  className={styles.button}
                  style={{
                    background: "#c68e17",
                    color: "#fff",
                  }}
                  onClick={() => router.push("/loja")}
                >
                  Voltar à loja
                </button>
                {feedback && (
                  <span
                    style={{
                      color: "#c68e17",
                      fontWeight: 600,
                      marginLeft: 12,
                      fontSize: 15,
                      background: "#fff6",
                      borderRadius: 6,
                      padding: "6px 16px",
                    }}
                  >
                    {feedback}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
