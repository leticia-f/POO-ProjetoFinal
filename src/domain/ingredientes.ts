export const VALIDADE_EM_DIAS: Record<string, number> = {
  cafe: 30,
  leite: 3,
  massa: 5,
};
export interface PedidoEmTransitoJSON {
  fornecedorNome: string;
  ingrediente: string;
  quantidade: number;
  custoUnitario: number;
  diasRestantes: number;
  qualidade: number;
}