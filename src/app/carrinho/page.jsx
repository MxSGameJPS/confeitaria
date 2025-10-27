"use client";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import styles from "./carrinho.module.css";

export default function Carrinho() {
  const { items, remove, total, clear } = useCart();

  function checkout() {
    // montar mensagem e redirecionar para WhatsApp
    const phone = "5511999999999"; // troque para o número da confeitaria
    const lines = items.map(
      (i) => `${i.qty}x ${i.name} - R$ ${i.price.toFixed(2)}`
    );
    lines.push(`Total: R$ ${total.toFixed(2)}`);
    const message = encodeURIComponent(
      `Olá, gostaria de fazer o pedido:\n${lines.join("\n")}`
    );
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.location.href = url;
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Seu Carrinho</h1>
        {items.length === 0 && <p>Seu carrinho está vazio.</p>}
        <ul className={styles.list}>
          {items.map((i) => (
            <li key={i.id} className={styles.item}>
              <img src={i.mainImage} alt={i.name} />
              <div>
                <h4>{i.name}</h4>
                <p>Quantidade: {i.qty}</p>
                <p>R$ {(i.price * i.qty).toFixed(2)}</p>
                <button onClick={() => remove(i.id)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.summary}>
          <p>Total: R$ {total.toFixed(2)}</p>
          <button onClick={checkout} className={styles.checkout}>
            Finalizar pedido (WhatsApp)
          </button>
          <button onClick={clear} className={styles.clear}>
            Limpar
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
