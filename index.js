export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Método GET: Retorna a lista de usuários cadastrados do banco D1
    if (request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM usuarios ORDER BY id DESC LIMIT 100"
        ).all();
        
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ sucesso: false, erro: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Método POST: Salva o novo usuário vindo da página de verificação facial
    if (request.method === "POST") {
      try {
        const dados = await request.json();
        const nome = dados.nome || '';
        const email = dados.email || '';
        const senha = dados.senha || '';
        const idade = dados.idade || 0;
        const tipoAcesso = dados.tipoAcesso || 'limitado';
        const dataRegistro = new Date().toISOString();

        await env.DB.prepare(
          "INSERT INTO usuarios (nome, email, senha, idade, tipo_acesso, data) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(nome, email, senha, idade, tipoAcesso, dataRegistro).run();

        return new Response(JSON.stringify({ sucesso: true, mensagem: "Salvo com sucesso!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ sucesso: false, erro: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("IstFlow Worker rodando com sucesso!", { headers: corsHeaders });
  },
};
