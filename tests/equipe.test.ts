import { assertEquals, assertThrows } from "@std/assert";
import { Atendente, Barista } from "../src/domain/Funcionarios.ts";
import { Equipe } from "../src/domain/Equipe.ts";

Deno.test("satisfação e capacidade dependem do salário", () => {
  // salário de mercado do barista: 8000
  assertEquals(new Barista("Ana", 8000).satisfacao(), 50);
  assertEquals(new Barista("Ana", 9600).satisfacao(), 70);
  assertEquals(new Barista("Ana", 4000).satisfacao(), 0);

  assertEquals(new Barista("Ana", 8000).capacidadeDeAtendimento(), 30);
  assertEquals(new Barista("Ana", 4000).capacidadeDeAtendimento(), 15);
});

Deno.test("três dias seguidos insatisfeito fazem o funcionário pedir demissão", () => {
  const barista = new Barista("Ana", 4000); // satisfação 0

  barista.novoDia();
  barista.novoDia();
  assertEquals(barista.pediuDemissao(), false);

  barista.novoDia();
  assertEquals(barista.pediuDemissao(), true);
});

Deno.test("um dia satisfeito zera a contagem de insatisfação", () => {
  const barista = new Barista("Ana", 4000); // satisfação 0
  barista.novoDia();
  barista.novoDia();

  barista.definirSalario(8000); // volta ao salário de mercado
  barista.novoDia();

  assertEquals(barista.getDiasInsatisfeito(), 0);
  assertEquals(barista.pediuDemissao(), false);
});

Deno.test("equipe soma a capacidade e a folha de pagamento", () => {
  const equipe = new Equipe();
  equipe.contratar(new Barista("Ana"));
  equipe.contratar(new Atendente("Beto"));

  assertEquals(equipe.capacidadeDeAtendimento(), 55);
  assertEquals(equipe.folhaDoDia(), 14000);
});

Deno.test("equipe tem no máximo 6 funcionários e não repete nomes", () => {
  const equipe = new Equipe();
  equipe.contratar(new Barista("Ana"));
  assertThrows(
    () => equipe.contratar(new Atendente("ana")),
    Error,
    "Já existe",
  );

  for (let i = 2; i <= 6; i++) {
    equipe.contratar(new Atendente(`Pessoa ${i}`));
  }
  assertThrows(
    () => equipe.contratar(new Atendente("Sétima")),
    Error,
    "máximo de 6",
  );
});

Deno.test("novoDia remove da equipe quem pediu demissão", () => {
  const equipe = new Equipe();
  equipe.contratar(new Barista("Ana", 4000)); // insatisfeita
  equipe.contratar(new Atendente("Beto")); // satisfeito

  equipe.novoDia();
  equipe.novoDia();
  assertEquals(equipe.listar().length, 2);

  equipe.novoDia(); // terceiro dia: Ana pede demissão
  assertEquals(equipe.pediramDemissaoNoDia(), ["Ana"]);
  assertEquals(equipe.listar().map((f) => f.nome), ["Beto"]);
});