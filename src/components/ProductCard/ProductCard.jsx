import Link from "next/link";
import styles from "./productcard.module.css";

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.mainImage || product.main_image}
          alt={product.name}
          className={styles.image}
        />
        {product.tags?.length > 0 && (
          <div className={styles.tagRibbon}>{product.tags[0]}</div>
        )}
      </div>
      <div className={styles.content}>
        <h3>{product.name}</h3>
        <p className={styles.price}>
          R${" "}
          {typeof product.price === "number"
            ? product.price.toFixed(2)
            : Number(product.price).toFixed(2)}
        </p>
        <Link href={`/produto/${product.slug}`} className={styles.button}>
          Ver produto
        </Link>
      </div>
    </div>
  );
}
