"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./header.module.css";
import { useCart } from "../../context/CartContext";

export default function Header() {
  // Detecta usuário logado pelo localStorage (client only)
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(localStorage.getItem("client_email"));
    }
  }, []);

  const { items } = useCart();
  const cartCount = items.reduce(
    (sum, item) => sum + (item.qty || item.quantity || 1),
    0
  );

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>
          Abraço de Vó
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/loja">Loja</Link>
        {!user && <Link href="/cadastro">Cadastro</Link>}
        {!user && <Link href="/login">Login</Link>}
        <Link href="/carrinho" className={styles.cartLink}>
          Carrinho
          {cartCount > 0 && (
            <span className={styles.cartCount}>{cartCount}</span>
          )}
        </Link>
        {user && (
          <>
            <Link href="/perfil">Perfil</Link>
            <span className={styles.user}>{user}</span>
          </>
        )}
      </nav>
    </header>
  );
}
