import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API = "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/cafeteria": API,
      "/relatorios": API,
      "/estoque": API,
      "/fornecedores": API,
      "/compras": API,
      "/produtos": API,
      "/funcionarios": API,
      "/eventos": API,
      "/partidas": API,
    },
  },
});
