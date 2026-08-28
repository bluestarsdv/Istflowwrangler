export default {
  async fetch(request, env) {
    try {
      // 1. Cria a tabela caso ela não exista
      await env.MY_DB.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          CustomerName TEXT,
          OrderDate INTEGER,
          ShippedDate INTEGER
        )
      `).run();

      // 2. Insere um dado de teste (opcional, só para não vir vazio)
      await env.MY_DB.prepare(`
        INSERT OR IGNORE INTO orders (id, CustomerName, OrderDate, ShippedDate) 
        VALUES ('1', 'Cliente Exemplo', 1700000000, 1700005000)
      `).run();

      // 3. Puxa os dados da tabela correta
      const result = await env.MY_DB.prepare(
        "SELECT id AS Id, CustomerName, OrderDate FROM orders ORDER BY ShippedDate DESC LIMIT 100"
      ).all();
      
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ erro: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
}
