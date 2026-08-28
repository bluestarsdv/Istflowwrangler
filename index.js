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

    if (request.method === "POST") {
      try {
        const dados = await request.json();
        
        // Aqui você faria o que quiser com os dados recebidos (nome, email, etc)
        console.log("Dados recebidos:", dados);

        return new Response(JSON.stringify({ 
          sucesso: true, 
          mensagem: "Recebido com sucesso!",
          dadosRecebidos: dados 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ sucesso: false, erro: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ 
      status: "online", 
      mensagem: "Worker rodando perfeitamente!" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  },
};
