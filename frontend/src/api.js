async function request(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro ?? "Erro na requisição.");
  return dados;
}

const enviar = (metodo) => (url, corpo) => request(url, {
  method: metodo,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(corpo ?? {}),
});

const post = enviar("POST");
const put = enviar("PUT");

export const api = {
  cafeteria: () => request("/cafeteria"),
  proximoDia: () => post("/cafeteria/dias"),
  relatorios: () => request("/relatorios"),
  estoque: () => request("/estoque"),
  fornecedores: () => request("/fornecedores"),
  compras: () => request("/compras"),
  comprar: (compra) => post("/compras", compra),
  produtos: () => request("/produtos"),
  criarProduto: (produto) => post("/produtos", produto),
  alterarPreco: (nome, preco) =>
    put(`/produtos/${encodeURIComponent(nome)}/preco`, { preco }),
  funcionarios: () => request("/funcionarios"),
  eventos: () => request("/eventos"),
};
