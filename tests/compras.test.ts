import { assertEquals, assertThrows } from "jsr:@std/assert";
import { Estoque } from "../src/domain/Estoque.ts";
import { Fornecedor } from "../src/domain/Fornecedor.ts";
import { GerenteDeCompras } from "../src/domain/GerenciadorDeCompras.ts";

Deno.test("orcar calcula preço * quantidade * multiplicador arredondado com Math.round", () => {
  const estoque = new Estoque();
  const forn = new Fornecedor("Premium", 5, 0, { leite: 33 });
  const gerente = new GerenteDeCompras(estoque, [forn]);

  // 33 * 3 * 1.15 = 113.85 -> 114
  assertEquals(gerente.orcar("Premium", "leite", 3, 1.15), 114);
});

Deno.test("comprar com prazo 0 adiciona lote direto no estoque", () => {
  const estoque = new Estoque();
  const atacadao = new Fornecedor("Atacadão", 3, 0,{ cafe: 100 });
  const gerente = new GerenteDeCompras(estoque, [atacadao]);

  gerente.comprar("Atacadão", "cafe", 5, 1.0);

  assertEquals(estoque.quantidadeDe("cafe"), 5);
  assertEquals(gerente.listarPedidos().length, 0);
});

Deno.test("comprar com prazo > 0 cria pedido em trânsito e entrega no novoDia", () => {
  const estoque = new Estoque();
  const fazenda = new Fornecedor("Fazenda", 5, 2,{ cafe: 150 });
  const gerente = new GerenteDeCompras(estoque, [fazenda]);

  gerente.comprar("Fazenda", "cafe", 4, 1.0);

  assertEquals(estoque.quantidadeDe("cafe"), 0);
  assertEquals(gerente.listarPedidos().length, 1);

  gerente.novoDia();
  assertEquals(estoque.quantidadeDe("cafe"), 0);
  assertEquals(gerente.listarPedidos().length, 1);

  gerente.novoDia();
  assertEquals(estoque.quantidadeDe("cafe"), 4);
  assertEquals(gerente.listarPedidos().length, 0);
});

Deno.test("lança erro ao orçar ou comprar de fornecedor inexistente", () => {
  const estoque = new Estoque();
  const gerente = new GerenteDeCompras(estoque, []);

  assertThrows(() => gerente.orcar("Desconhecido", "cafe", 1, 1.0));
  assertThrows(() => gerente.comprar("Desconhecido", "cafe", 1, 1.0));
});