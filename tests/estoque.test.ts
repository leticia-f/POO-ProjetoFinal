import { assertEquals, assertThrows } from "jsr:@std/assert";
import { LoteDeIngrediente } from "../src/domain/LoteDeIngrediente.ts";
import { Estoque } from "../src/domain/Estoque.ts";
import { Fornecedor, fornecedoresIniciais } from "../src/domain/Fornecedor.ts";
import { PedidoDeCompra } from "../src/domain/PedidoDeCompra.ts";
import type { ReservaDeIngredientes } from "../src/domain/ReservaDeIngredientes.ts";

Deno.test("consumir retira primeiro o lote que vence antes", () => {
  const estoque = new Estoque();
  const loteMaisNovo = new LoteDeIngrediente("leite", 10, 3, 80, 5);
  const loteMaisVelho = new LoteDeIngrediente("leite", 5, 1, 80, 2);

  estoque.adicionarLote(loteMaisNovo);
  estoque.adicionarLote(loteMaisVelho);

  const qualidadeUsada = estoque.consumir({ leite: 4 });

  assertEquals(qualidadeUsada, 2);
  assertEquals(loteMaisVelho.getQuantidade(), 1);
  assertEquals(loteMaisNovo.getQuantidade(), 10);
});

Deno.test("consumir com falta de ingrediente lança erro e não retira nada (tudo ou nada)", () => {
  const estoque = new Estoque();
  estoque.adicionarLote(new LoteDeIngrediente("cafe", 10, 30, 120, 3));
  estoque.adicionarLote(new LoteDeIngrediente("leite", 1, 3, 80, 3));

  assertThrows(
    () => estoque.consumir({ cafe: 2, leite: 2 }),
    Error,
    "Ingredientes insuficientes no estoque.",
  );

  assertEquals(estoque.quantidadeDe("cafe"), 10);
  assertEquals(estoque.quantidadeDe("leite"), 1);
});

Deno.test("lote vencido é descartado no novoDia e entra nas perdas do dia", () => {
  const estoque = new Estoque();
  estoque.adicionarLote(new LoteDeIngrediente("leite", 5, 1, 80, 3));
  estoque.adicionarLote(new LoteDeIngrediente("cafe", 10, 10, 120, 4));

  estoque.novoDia();

  assertEquals(estoque.quantidadeDe("leite"), 0);
  assertEquals(estoque.quantidadeDe("cafe"), 10);
  assertEquals(estoque.valorPerdidoNoDia(), 400);
});

Deno.test("consumir calcula corretamente a qualidade média ponderada entre múltiplos lotes", () => {
  const estoque: ReservaDeIngredientes = new Estoque();
  (estoque as Estoque).adicionarLote(new LoteDeIngrediente("cafe", 2, 1, 100, 2));
  (estoque as Estoque).adicionarLote(new LoteDeIngrediente("cafe", 8, 5, 150, 5));

  const qualidadeMedia = estoque.consumir({ cafe: 4 });
  assertEquals(qualidadeMedia, 3.5);
});

Deno.test("precoDe lança erro se o fornecedor não vende o ingrediente", () => {
  const fornecedores = fornecedoresIniciais();
  const mercadinho = fornecedores[0];

  assertEquals(mercadinho.precoDe("cafe"), 120);
  assertThrows(
    () => mercadinho.precoDe("chocolate"),
    Error,
  );
});

Deno.test("PedidoDeCompra avança os dias e indica quando chegou", () => {
  const pedido = new PedidoDeCompra("Atacado Central", "cafe", 20, 90, 2, 2);

  assertEquals(pedido.chegou(), false);
  pedido.novoDia();
  assertEquals(pedido.chegou(), false);
  pedido.novoDia();
  assertEquals(pedido.chegou(), true);
});