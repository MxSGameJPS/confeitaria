import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>Abraço de Vó</strong>
        <p>Doçura e carinho em cada fatia.</p>
      </div>
      <div>
        <small>© {new Date().getFullYear()} Abraço de Vó</small>
      </div>
    </footer>
  );
}
