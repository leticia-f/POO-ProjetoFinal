import { useState } from "react";

// Na semana 2, cada pessoa substituirá o conteúdo provisório pela sua tela.
const abas = [
  { nome: "Painel", componente: <p>O painel do dia será implementado pela Pessoa C.</p> },
  { nome: "Estoque", componente: <p>O estoque será implementado pela Pessoa A.</p> },
  { nome: "Cardápio", componente: <p>O cardápio será implementado pela Pessoa B.</p> },
  { nome: "Equipe", componente: <p>A equipe será implementada pela Pessoa D.</p> },
  { nome: "Partidas", componente: <p>Salvar e carregar partidas: semana 3.</p> },
  { nome: "Gráficos", componente: <p>Gráficos da Pessoa B: semana 3.</p> },
];

export default function App() {
  const [abaAtiva, definirAbaAtiva] = useState(0);
  return (
    <div className="aplicacao">
      <header className="cabecalho">
        <span className="marca">☕ Café Tycoon</span>
        <span className="subtitulo">Simulador de cafeteria</span>
      </header>
      <main className="conteudo">
        <div className="apresentacao">
          <p className="etiqueta">Projeto de Programação Orientada a Objetos</p>
          <h1>Gerencie sua cafeteria</h1>
          <p>Compre ingredientes, ajuste preços e faça seu negócio crescer.</p>
        </div>
        <nav className="abas" aria-label="Navegação do jogo">
          {abas.map((aba, indice) => (
            <button
              key={aba.nome}
              type="button"
              className={abaAtiva === indice ? "ativa" : ""}
              aria-current={abaAtiva === indice ? "page" : undefined}
              onClick={() => definirAbaAtiva(indice)}
            >
              {aba.nome}
            </button>
          ))}
        </nav>
        <section className="painel" aria-live="polite">
          <h2>{abas[abaAtiva].nome}</h2>
          {abas[abaAtiva].componente}
        </section>
      </main>
    </div>
  );
}
