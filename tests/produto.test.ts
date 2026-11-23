import { assertEquals, assertThrows } from "@std/assert";
import { Produto } from "../src/domain/Produto.ts";

Deno.test("Produto respeita o contrato do cardápio", () => {
  const produto = new Produto("Espresso", { cafe: 1 }, 600);
  assertEquals(produto.nome, "Espresso");
  assertEquals(produto.getPreco(), 600);
  assertEquals(produto.receita, { cafe: 1 });
});

Deno.test("Produto recusa preço inválido e preserva o anterior", () => {
  const produto = new Produto("Espresso", { cafe: 1 }, 600);
  for (const preco of [0, -100, 3.5, NaN, Infinity]) {
    assertThrows(() => produto.definirPreco(preco));
    assertEquals(produto.getPreco(), 600);
  }
  assertThrows(() => new Produto("X", { cafe: 1 }, 0));
});

Deno.test("Produto valida receita e protege os ingredientes internos", () => {
  assertThrows(() => new Produto("X", {}, 100));
  assertThrows(() => new Produto("X", { cafe: 0 }, 100));
  assertThrows(() => new Produto("X", { cafe: 1.5 }, 100));
  const receita = { cafe: 1 };
  const produto = new Produto("Espresso", receita, 600);
  receita.cafe = 99;
  produto.receita.cafe = 77;
  assertEquals(produto.receita.cafe, 1);
});

Deno.test("Produto calcula custo estimado e margem sem o estoque real", () => {
  const produto = new Produto("Cappuccino", { cafe: 1, leite: 1 }, 1200);
  const custoDe = (ingrediente: string): number =>
    ({ cafe: 120, leite: 200 } as Record<string, number>)[ingrediente];
  assertEquals(produto.custoEstimado(custoDe), 320);
  assertEquals(produto.margem(custoDe), 880);
});

Deno.test("Produto pode ser salvo e restaurado", () => {
  const original = new Produto("Espresso", { cafe: 1 }, 600);
  assertEquals(Produto.restaurarEstado(original.paraJSON()).paraJSON(), original.paraJSON());
});
