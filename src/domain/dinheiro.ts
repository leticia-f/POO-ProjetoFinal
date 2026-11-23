export function formatarReais(centavos: number): string {
  if (!Number.isFinite(centavos)) {
    throw new Error("Valor monetário inválido.");
  }
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
