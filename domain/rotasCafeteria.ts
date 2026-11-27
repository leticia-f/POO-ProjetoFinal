import { Router } from "express";
import type { Request, Response } from "express";
import type { Cafeteria } from "../domain/Cafeteria.ts";

function traduzirErro(error: unknown, res: Response): void {
  const mensagem = error instanceof Error ? error.message : "Erro interno.";
  if (mensagem.includes("terminou")) {
    res.status(409).json({ erro: mensagem });
    return;
  }
  res.status(400).json({ erro: mensagem });
}

export function rotasCafeteria(cafeteria: Cafeteria): Router {
  const rotas = Router();

  rotas.get("/cafeteria", (_req: Request, res: Response) => {
    res.json(cafeteria.paraJSON());
  });

  rotas.post("/cafeteria/dias", (_req: Request, res: Response) => {
    try {
      const relatorio = cafeteria.novoDia();
      res.status(201).json({
        dia: cafeteria.getDia(),
        caixa: cafeteria.getCaixa(),
        reputacao: cafeteria.getReputacao(),
        situacao: cafeteria.getSituacao(),
        relatorio: relatorio.paraJSON(),
        lucro: relatorio.lucro(),
      });
    } catch (error) {
      traduzirErro(error, res);
    }
  });

  rotas.get("/relatorios", (_req: Request, res: Response) => {
    res.json(cafeteria.listarRelatorios().map((r) => r.paraJSON()));
  });

  return rotas;
}