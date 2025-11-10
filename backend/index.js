const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// --- Rutas de API ---
app.post("/api/calcular", (req, res) => {
  const { numero } = req.body;
  if (numero === undefined || numero === "" || isNaN(numero)) {
    return res.status(400).json({ error: "Debes ingresar un número válido." });
  }

  let numeroStr = numero.toString();
  if (numeroStr.length > 8) {
    return res.status(400).json({ error: "El número no puede tener más de 8 dígitos." });
  }

  const n = parseInt(numero);

  // --- Raíz cuadrada entera ---
  let raiz = 0;
  while ((raiz + 1) * (raiz + 1) <= n) {
    raiz++;
  }

  // --- Residuo ---
  const residuo = n - raiz * raiz;

  // --- Verificar si es primo ---
  let esPrimo = n >= 2;
  for (let i = 2; i <= n / 2 && esPrimo; i++) {
    if (n % i === 0) esPrimo = false;
  }

  // --- Factores primos ≤ raíz ---
  let factores = [];
  for (let candidato = 2; candidato <= raiz; candidato++) {
    let primo = true;
    for (let j = 2; j <= candidato / 2 && primo; j++) {
      if (candidato % j === 0) primo = false;
    }
    if (primo) factores.push(candidato);
  }

  res.json({
    numero: n,
    esPrimo,
    raiz,
    residuo,
    factores: factores.length > 0 ? factores.join(" ") : "No hay factores primos."
  });
});

// --- Servir React en producción ---
const buildPath = path.join(__dirname, "frontend/build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // Ruta catch-all para React
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// --- Levantar servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
