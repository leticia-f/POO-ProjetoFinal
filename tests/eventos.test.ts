import { assertEquals, assertThrows } from "@std/assert";
import { GeradorEventos } from "../src/domain/GeradorEventos.ts";
import { DiaDeChuva, Festival, GreveFornecedores } from "../src/domain/Eventos.ts";

Deno.test("cada evento termina depois dos seus dias: chuva 2, greve 3, festival 1", () => {
  const chuva = new DiaDeChuva();
  chuva.novoDia();
  assertEquals(chuva.terminou(), false);
  chuva.novoDia();
  assertEquals(chuva.terminou(), true);

  const greve = new GreveFornecedores();
  greve.novoDia();
  greve.novoDia();
  assertEquals(greve.terminou(), false);
  greve.novoDia();
  assertEquals(greve.terminou(), true);

  const festival = new Festival();
  festival.novoDia();
  assertEquals(festival.terminou(), true);
});

Deno.test("cada evento muda só o que deve mudar", () => {
  assertEquals(new DiaDeChuva().multiplicadorDeDemanda(), 0.7);
  assertEquals(new DiaDeChuva().multiplicadorDeCusto(), 1);

  assertEquals(new GreveFornecedores().multiplicadorDeDemanda(), 1);
  assertEquals(new GreveFornecedores().multiplicadorDeCusto(), 1.5);

  assertEquals(new Festival().multiplicadorDeDemanda(), 1.5);
  assertEquals(new Festival().multiplicadorDeCusto(), 1);
});

Deno.test("a fábrica só sorteia evento quando o número é menor que 0,2", () => {
  const fabrica = new GeradorEventos();

  // O sorteador aqui sempre devolve o mesmo número, para o teste ser previsível.
  assertEquals(fabrica.sortear({ proximo: () => 0.9 }, []), undefined);
  assertEquals(
    fabrica.sortear({ proximo: () => 0.1 }, [])?.nome,
    "Dia de chuva",
  );
});

Deno.test("a fábrica não repete um evento que já está ativo", () => {
  const fabrica = new GeradorEventos();
  const ativos = [new DiaDeChuva()];

  const sorteado = fabrica.sortear({ proximo: () => 0.1 }, ativos);

  assertEquals(sorteado?.nome, "Greve de fornecedores");
});

Deno.test("paraJSON do evento guarda o nome e os dias restantes", () => {
  const chuva = new DiaDeChuva();
  chuva.novoDia();

  assertEquals(chuva.paraJSON(), { nome: "Dia de chuva", diasRestantes: 1 });
});

Deno.test("restaurar recria o evento com os dias que faltavam", () => {
  const fabrica = new GeradorEventos();

  const greve = fabrica.restaurar("Greve de fornecedores", 1);
  assertEquals(greve.terminou(), false);
  greve.novoDia();
  assertEquals(greve.terminou(), true);

  assertThrows(() => fabrica.restaurar("Meteoro", 1), Error, "desconhecido");
  assertThrows(() => fabrica.restaurar("Dia de chuva", -1), Error, "inválidos");
});