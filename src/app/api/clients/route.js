// POST /api/clients/login: autentica usuário
export async function POST_login(req) {
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
    const result = await client.query(
      "SELECT * FROM clients WHERE email = $1 AND password = $2",
      [body.email, body.password]
    );
    await client.end();
    if (result.rows.length === 1) {
      // Usuário autenticado
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } else {
      // Credenciais inválidas
      return new Response(
        JSON.stringify({ error: "Email ou senha inválidos" }),
        { status: 401 }
      );
    }
  } catch (err) {
    try {
      if (client) await client.end();
    } catch (e) {}
    return new Response(
      JSON.stringify({ error: err?.message || "Erro ao autenticar" }),
      { status: 500 }
    );
  }
}
import { Client } from "pg";

// GET: lista todos os clientes ou busca por id/email
export async function GET(req) {
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
    // Busca por id ou email
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    let result;
    if (id) {
      result = await client.query("SELECT * FROM clients WHERE id = $1", [id]);
      await client.end();
      return new Response(JSON.stringify(result.rows[0] || {}), {
        status: 200,
      });
    } else if (email) {
      result = await client.query("SELECT * FROM clients WHERE email = $1", [
        email,
      ]);
      await client.end();
      return new Response(JSON.stringify(result.rows[0] || {}), {
        status: 200,
      });
    } else {
      result = await client.query(
        "SELECT * FROM clients ORDER BY created_at DESC"
      );
      await client.end();
      return new Response(JSON.stringify(result.rows || []), { status: 200 });
    }
  } catch (err) {
    console.error("/api/clients db error:", err?.message || err);
    try {
      if (client) await client.end();
    } catch (e) {}
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// POST: insere novo cliente na tabela clients do banco Neon
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
    const query = `INSERT INTO clients (full_name, cep, street, number, complement, reference, whatsapp, email, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;
    const values = [
      body.full_name,
      body.cep,
      body.street,
      body.number,
      body.complement,
      body.reference,
      body.whatsapp,
      body.email,
      body.password,
    ];
    const result = await client.query(query, values);
    await client.end();
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error("/api/clients db error:", err?.message || err);
    try {
      if (client) await client.end();
    } catch (e) {}
    return new Response(
      JSON.stringify({ error: err?.message || "Erro ao cadastrar cliente" }),
      { status: 500 }
    );
  }
}
