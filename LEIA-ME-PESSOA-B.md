# Entrega Pessoa B — Semana 1

Arquivos preparados a partir do PDF Café Tycoon — Guia Completo do Projeto (página 24).

## Como integrar ao repositório do grupo

A pasta `src/domain` deste pacote contém **apenas arquivos novos** da Pessoa B. O contrato `Receita.ts` **já existe no repositório** e deve ser mantido.

1. Clone `https://github.com/leticia-f/POO-ProjetoFinal`.
2. Rode `git checkout -b feat/pessoa-b-semana-1` na raiz do projeto clonado.
3. Copie as pastas `src`, `tests` e `frontend` deste pacote para a raiz do projeto, mesclando as pastas (não substitua `src/domain` e `tests` por inteiro).
4. Rode `deno task test` na raiz do repositório.
5. Rode `cd frontend`, `npm install` e `npm run dev` e abra a URL fornecida pelo Vite.
6. Rode `deno check src/main.ts`.
7. Se os testes passarem, faça `git add .`, `git commit -m "feat: implementa modulo da pessoa B semana 1"`, `git push -u origin feat/pessoa-b-semana-1` e abra um Pull Request.

**Importante:** a API do grupo ainda não está implementada; as abas do frontend mostram textos provisórios, como exige o cronograma da semana 1.

**Nota:** este pacote ainda não foi submetido ao GitHub por bloqueio de permissão na criação da branch via integração. O pacote foi preparado separadamente para não alterar a `main`.
