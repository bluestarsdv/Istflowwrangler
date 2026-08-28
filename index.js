export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Rota principal: Cria todas as tabelas padrão automaticamente e lista os dados de orders
      if (path === "/" || path === "") {
        // Cria tabela de Ordens
        await env.MY_DB.prepare(`
          CREATE TABLE IF NOT EXISTS "Order" (
            Id TEXT PRIMARY KEY,
            CustomerName TEXT,
            OrderDate INTEGER,
            ShippedDate INTEGER
          )
        `).run();

        // Cria tabela de Usuários (exemplo extra)
        await env.MY_DB.prepare(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            data_criacao TEXT
          )
        `).run();

        const result = await env.MY_DB.prepare(
          "SELECT Id, CustomerName, OrderDate FROM \"Order\" ORDER BY ShippedDate DESC LIMIT 100"
        ).all();

        return new Response(JSON.stringify({ 
          status: "Banco inicializado com sucesso!", 
          tabelas_criadas: ["Order", "usuarios"],
          dados: result 
        }, null, 2), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. Rota para criar tabelas personalizadas: /createtable
      if (path === "/createtable" && request.method === "POST") {
        const body = await request.json();
        const sqlQuery = body.sql;

        if (!sqlQuery) {
          return new Response(JSON.stringify({ erro: "Envie a query SQL no corpo da requisição (ex: { sql: 'CREATE TABLE ...' })" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        await env.MY_DB.prepare(sqlQuery).run();

        return new Response(JSON.stringify({ sucesso: true, mensagem: "Tabela criada com sucesso via SQL!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 3. Rota para inserir dados dinamicamente: /createdataintable
      if (path === "/createdataintable" && request.method === "POST") {
        const body = await request.json();
        const sqlQuery = body.sql;
        const params = body.params || [];

        if (!sqlQuery) {
          return new Response(JSON.stringify({ erro: "Envie a query SQL no corpo (ex: { sql: 'INSERT INTO...', params: [...] })" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        await env.MY_DB.prepare(sqlQuery).bind(...params).run();

        return new Response(JSON.stringify({ sucesso: true, mensagem: "Dados inseridos com sucesso na tabela!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ erro: "Rota não encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ sucesso: false, erro: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
}
