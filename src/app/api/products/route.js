import { Client } from "pg";

// GET /api/products
// Tentativa de conectar ao banco Postgres (Neon) usando DATABASE_URL.
// Se não houver DATABASE_URL ou ocorrer erro, retornamos um array vazio
// (não usamos o `products.json` em produção conforme solicitado).
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  let client;
  try {
    client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    // Ajuste a consulta conforme o schema real; usar colunas comuns.
    const result = await client.query(
      `SELECT id, name, price, slug, main_image, images, prep_time, description, tags, ingredients, promotion, active
       FROM products
       WHERE active = true
       ORDER BY name`
    );

    await client.end();
    return new Response(JSON.stringify(result.rows || []), { status: 200 });
  } catch (err) {
    console.error("/api/products db error:", err?.message || err);
    try {
      if (client) await client.end();
    } catch (e) {
      /* ignore */
    }
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// POST /api/products
export async function POST(req) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(
      JSON.stringify({ error: "DATABASE_URL não configurada" }),
      { status: 500 }
    );
  }
  const body = await req.json();
  let client;
  try {
    client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    // Gerar slug a partir do nome
    const slug = body.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const result = await client.query(
      `INSERT INTO products (name, price, description, tags, ingredients, promotion, main_image, images, active, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
       RETURNING *`,
      [
        body.name,
        body.price,
        body.description,
        body.tags,
        body.ingredients,
        body.promotion,
        body.main_image,
        body.images,
        slug,
      ]
    );
    await client.end();
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    try {
      if (client) await client.end();
    } catch (e) {}
    return new Response(
      JSON.stringify({ error: err?.message || "Erro ao cadastrar produto" }),
      { status: 500 }
    );
  }
}
