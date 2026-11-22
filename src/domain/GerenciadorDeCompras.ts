import { Estoque } from "./Estoque.ts";
import { Fornecedor } from "./Fornecedor.ts";
import { LoteDeIngrediente } from "./LoteDeIngrediente.ts";
import { PedidoDeCompra } from "./PedidoDeCompra.ts";
import { PedidoEmTransitoJSON, VALIDADE_EM_DIAS } from "./ingredientes.ts";
import { AtualizavelPorDia } from "./AtualizavelPorDia.ts";

export class GerenteDeCompras implements AtualizavelPorDia {
  private readonly estoque: Estoque;
  private readonly fornecedores: readonly Fornecedor[];
  private pedidos: PedidoDeCompra[] = [];

  constructor(estoque: Estoque, fornecedores: readonly Fornecedor[]) {
    this.estoque = estoque;
    this.fornecedores = [...fornecedores];
  }

  private buscarFornecedor(nomeFornecedor: string): Fornecedor {
    const encontrado = this.fornecedores.find(
      (f) => f.getNome() === nomeFornecedor,
    );
    if (!encontrado) {
      throw new Error(`Fornecedor não encontrado: "${nomeFornecedor}".`);
    }
    return encontrado;
  }

  orcar(
    fornecedor: string,
    ingrediente: string,
    quantidade: number,
    multiplicadorDeCusto: number,
  ): number {
    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }
    const forn = this.buscarFornecedor(fornecedor);
    const precoUnitario = forn.precoDe(ingrediente);
    return Math.round(precoUnitario * quantidade * multiplicadorDeCusto);
  }

  comprar(
    fornecedor: string,
    ingrediente: string,
    quantidade: number,
    multiplicadorDeCusto: number,
  ): void {
    const custoTotal = this.orcar(
      fornecedor,
      ingrediente,
      quantidade,
      multiplicadorDeCusto,
    );
    const forn = this.buscarFornecedor(fornecedor);
    const custoUnitario = Math.round(custoTotal / quantidade);
    const validade = VALIDADE_EM_DIAS[ingrediente];

    if (validade === undefined) {
      throw new Error(`Validade não definida para o ingrediente: "${ingrediente}".`);
    }

    if (forn.getPrazoDeEntrega() === 0) {
      const lote = new LoteDeIngrediente(
        ingrediente,
        quantidade,
        validade,
        custoUnitario,
        forn.getQualidade(),
      );
      this.estoque.adicionarLote(lote);
    } else {
      const pedido = new PedidoDeCompra(
        forn.getNome(),
        ingrediente,
        quantidade,
        custoUnitario,
        forn.getPrazoDeEntrega(),
        forn.getQualidade(),
      );
      this.pedidos.push(pedido);
    }
  }

  novoDia(): void {
    const aindaEmTransito: PedidoDeCompra[] = [];

    for (const pedido of this.pedidos) {
      pedido.novoDia();

      if (pedido.chegou()) {
        const lote = new LoteDeIngrediente(
          pedido.getIngrediente(),
          pedido.getQuantidade(),
          VALIDADE_EM_DIAS[pedido.getIngrediente()],
          pedido.getCustoUnitario(),
          pedido.getQualidade(),
        );
        this.estoque.adicionarLote(lote);
      } else {
        aindaEmTransito.push(pedido);
      }
    }

    this.pedidos = aindaEmTransito;
  }

  listarPedidos(): readonly PedidoDeCompra[] {
    return [...this.pedidos];
  }

  listarFornecedores(): readonly Fornecedor[] {
    return [...this.fornecedores];
  }

  paraJSON(): PedidoEmTransitoJSON[] {
    return this.pedidos.map((p) => ({
      fornecedorNome: p.getFornecedor(),
      ingrediente: p.getIngrediente(),
      quantidade: p.getQuantidade(),
      custoUnitario: p.getCustoUnitario(),
      diasRestantes: p.getDiasParaChegar(),
      qualidade: p.getQualidade(),
    }));
  }

  restaurarEstado(dados: PedidoEmTransitoJSON[]): void {
    this.pedidos = dados.map(
      (d) =>
        new PedidoDeCompra(
          d.fornecedorNome,
          d.ingrediente,
          d.quantidade,
          d.custoUnitario,
          d.diasRestantes,
          d.qualidade,
        ),
    );
  }
}