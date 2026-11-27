import { useState } from "react";
import { api } from "../api.js";
import { formatarReais } from "../formatar.js";

export function Painel({ cafeteria, relatorios, atualizar, onErro }) {
  const [carregando, setCarregando] = useState(false);

  if (!cafeteria) {
    return <p>Carregando painel...</p>;
  }

  const ultimoRelatorio = relatorios && relatorios.length > 0
    ? relatorios[relatorios.length - 1]
    : cafeteria.ultimoRelatorio;

  const eventos = cafeteria.eventosAtivos ?? [];
  const reputacao = Math.max(0, Math.min(100, cafeteria.reputacao ?? 0));

  async function handleProximoDia() {
    setCarregando(true);
    try {
      await api.proximoDia();
      await atualizar();
    } catch (err) {
      if (onErro) {
        onErro(err.message ?? "Não foi possível avançar o dia.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="painel">
      <header className="painel-cabecalho">
        <div>
          <h2>Dia {cafeteria.dia}</h2>
          <p>Situação: {cafeteria.situacao}</p>
        </div>

        <button
          type="button"
          onClick={handleProximoDia}
          disabled={carregando || cafeteria.situacao !== "em-andamento"}
        >
          {carregando ? "Simulando..." : "Próximo dia"}
        </button>
      </header>

      <div className="painel-indicadores">
        <div className="cartao">
          <span>Caixa</span>
          <strong>{formatarReais(cafeteria.caixa)}</strong>
        </div>

        <div className="cartao">
          <span>Reputação ({reputacao}/100)</span>
          <div className="barra-externa" aria-label="Reputação">
            <div
              className="barra-preenchimento"
              style={{ width: `${reputacao}%` }}
            />
          </div>
        </div>

        <div className="cartao">
          <span>Eventos ativos</span>
          {eventos.length === 0 ? (
            <p>Nenhum evento ativo</p>
          ) : (
            <ul>
              {eventos.map((nomeEvento) => (
                <li key={nomeEvento}>{nomeEvento}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <article className="cartao relatorio-dia">
        <h3>Relatório do último dia</h3>
        {!ultimoRelatorio ? (
          <p>Nenhum dia simulado ainda. Clique em Próximo dia.</p>
        ) : (
          <div>
            <p>
              <strong>Dia {ultimoRelatorio.dia}:</strong>{" "}
              {ultimoRelatorio.clientesAtendidos} atendidos |{" "}
              Perdidos: {ultimoRelatorio.perdidosPorPreco} (preço),{" "}
              {ultimoRelatorio.perdidosPorEstoque} (estoque),{" "}
              {ultimoRelatorio.perdidosPorAtendimento} (atendimento)
            </p>
            <p>
              Receita: {formatarReais(ultimoRelatorio.receita)} | Folha:{" "}
              {formatarReais(ultimoRelatorio.folha)} | Perdas:{" "}
              {formatarReais(ultimoRelatorio.perdas)}
            </p>
            <p>
              <strong>Lucro do dia:</strong> {formatarReais(ultimoRelatorio.lucro)}{" "}
              | <strong>Caixa final:</strong>{" "}
              {formatarReais(ultimoRelatorio.caixaFinal)}
            </p>
            {ultimoRelatorio.pediramDemissao?.length > 0 && (
              <p>
                Pediram demissão: {ultimoRelatorio.pediramDemissao.join(", ")}
              </p>
            )}
          </div>
        )}
      </article>
    </section>
  );
}