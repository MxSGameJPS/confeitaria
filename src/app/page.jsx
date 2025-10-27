import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.hero}>
        <div className={styles.info}>
          <h1>Abraço de Vó</h1>
          <p>
            Bem-vindo à Abraço de Vó — onde cada receita vem com memória,
            carinho e ingredientes selecionados. Fundada em 1995, nossa
            confeitaria nasceu de receitas passadas entre gerações e de um
            desejo simples: adoçar a vida das pessoas.
          </p>
          <Link href="/loja" className={styles.cta}>
            Ir para a loja
          </Link>
        </div>
        <div className={styles.gallery}>
          <div className={styles.big}>
            <video
              className={styles.heroVideo}
              src={
                "/videos/Video%20Reels%20para%20Bolos%20ou%20Tortas%20-%20Bolo%20Chocolatudo.mp4"
              }
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
         
        </div>
      </main>
      <Footer />
    </>
  );
}
