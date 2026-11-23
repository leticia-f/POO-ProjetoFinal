import { assertEquals, assertThrows } from "@std/assert";
import { Cardapio } from "../src/domain/Cardapio.ts";
import { Produto } from "../src/domain/Produto.ts";
import { cardapioInicial } from "../src/domain/catalogo.ts";

Deno.test("Cardápio não aceita produtos com nomes repetidos", () => {
  const cardapio = new Cardapio();
  cardapio.adicionar(new Produto("Espresso", { cafe: 1 }, 600));
  assertThrows(() => cardapio.adicionar(new Produto("espresso", { cafe: 1 }, 650)));
  assertEquals(cardapio.listar().length, 1);
});

Deno.test("Cardápio encontra e altera preços", () => {
  const cardapio = cardapioInicial();
  cardapio.definirPreco("espresso", 700);
  assertEquals(cardapio.encontrar("Espresso")?.getPreco(), 700);
  assertThrows(() => cardapio.definirPreco("Inexistente", 100));
  assertThrows(() => cardapio.definirPreco("Espresso", 0));
});

Deno.test("Cardápio remove produtos e lista por cópia", () => {
  const cardapio = cardapioInicial();
  const lista = cardapio.listar();
  assertEquals(lista.length, 3);
  cardapio.remover("ESPRESSO");
  assertEquals(lista.length, 3);
  assertEquals(cardapio.listar().length, 2);
  assertThrows(() => cardapio.remover("Espresso"));
});

Deno.test("Cardápio inicial contém os produtos e receitas do guia", () => {
  const produtos = cardapioInicial().listar();
  assertEquals(produtos.map((produto) => produto.paraJSON()), [
    { nome: "Espresso", receita: { cafe: 1 }, preco: 600 },
    { nome: "Cappuccino", receita: { cafe: 1, leite: 1 }, preco: 1200 },
    { nome: "Pão de queijo", receita: { massa: 1 }, preco: 500 },
  ]);
});

Deno.test("Cardápio restaura o estado e rejeita duplicatas", () => {
  const cardapio = new Cardapio();
  const dados = cardapioInicial().paraJSON();
  cardapio.restaurarEstado(dados);
  assertEquals(cardapio.paraJSON(), dados);
  assertThrows(() => cardapio.restaurarEstado({ produtos: [...dados.produtos, dados.produtos[0]] }));
  assertEquals(cardapio.paraJSON(), dados);
});
