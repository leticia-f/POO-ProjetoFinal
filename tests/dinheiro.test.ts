import { assertEquals, assertThrows } from "@std/assert";
import { formatarReais } from "../src/domain/dinheiro.ts";

Deno.test("Formata 600 centavos no padrão brasileiro", () => {
  assertEquals(formatarReais(600), "R$\u00a06,00".replace("\u00a0", " "));
});

Deno.test("Formata valores maiores e zero", () => {
  assertEquals(formatarReais(300000), "R$\u00a03.000,00".replace("\u00a0", " "));
  assertEquals(formatarReais(0), "R$\u00a00,00".replace("\u00a0", " "));
});

Deno.test("Não aceita números não finitos", () => {
  assertThrows(() => formatarReais(NaN));
  assertThrows(() => formatarReais(Infinity));
});
