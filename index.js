export default {
  async fetch(request, env) {
    try {
      const result = await env.MY_DB.prepare(
        "SELECT Id, CustomerName, OrderDate FROM \"Order\" ORDER BY ShippedDate DESC LIMIT 100"
      ).run();
      
      return new Response(JSON.stringify(result), {
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
