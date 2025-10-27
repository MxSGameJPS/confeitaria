// Script para atualizar slugs dos produtos existentes no banco Neon
const { Client } = require("pg");

async function updateSlugs() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL não configurada");
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const { rows } = await client.query(
    "SELECT id, name FROM products WHERE slug IS NULL OR slug = ''"
  );
  for (const prod of rows) {
    const slug = prod.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    await client.query("UPDATE products SET slug = $1 WHERE id = $2", [
      slug,
      prod.id,
    ]);
    console.log(`Produto ${prod.name} atualizado com slug: ${slug}`);
  }
  await client.end();
  console.log("Slugs atualizados!");
}

updateSlugs().catch((err) => {
  console.error("Erro ao atualizar slugs:", err);
  process.exit(1);
});
