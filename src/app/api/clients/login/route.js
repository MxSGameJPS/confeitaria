import { Client } from "pg";

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
