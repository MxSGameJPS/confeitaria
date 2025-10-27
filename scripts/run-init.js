const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Leia a variável de ambiente DATABASE_URL ou use a string fornecida
const CONNECTION =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_bCVeyH06GTaz@ep-red-leaf-act7253w-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
  const sqlPath = path.join(__dirname, "..", "db", "init.sql");
  if (!fs.existsSync(sqlPath)) {
    console.error("Arquivo db/init.sql não encontrado.");
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new Client({
    connectionString: CONNECTION,
    // Forçar SSL (Neon exige). Dependendo do ambiente, você pode ajustar rejectUnauthorized.
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Conectando ao banco...");
    await client.connect();
    console.log(
      "Executando SQL de inicialização... (pode demorar alguns segundos)"
    );
    await client.query(sql);
    console.log("Script executado com sucesso.");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao executar o SQL:", err.stack || err.message || err);
    process.exit(1);
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

run();
