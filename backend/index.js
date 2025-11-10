const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/calcular", (req, res) => {
  const { numero } = req.body;
  if (numero === undefined || numero === "" || isNaN(numero)) {
    return res.status(400).json({ error: "Debes ingresar un número válido." });
  }

  // Limitar a 8 dígitos
  let numeroStr = numero.toString();
  if (numeroStr.length > 8) {
    return res.status(400).json({ error: "El número no puede tener más de 8 dígitos." });
  }

  const n = parseInt(numero);

  // --- Raíz cuadrada entera ---
  let raiz = 0;
  while ((raiz + 1) * (raiz + 1) <= n) {
    raiz = raiz + 1;
  }

  // --- Residuo ---
  const residuo = n - raiz * raiz;

  // --- Verificar si es primo ---
  let esPrimo = true;
  if (n < 2) esPrimo = false;
  else {
    let i = 2;
    while (i <= n / 2) {
      if (n % i === 0) {
        esPrimo = false;
        break;
      }
      i = i + 1;
    }
  }

  // --- Factores primos ≤ raíz ---
  let factores = "";
  let candidato = 2;
  while (candidato <= raiz) {
    // Verificar si candidato es primo
    let primo = true;
    let j = 2;
    while (j <= candidato / 2) {
      if (candidato % j === 0) {
        primo = false;
        break;
      }
      j = j + 1;
    }
    if (primo) {
      factores = factores + candidato + " ";
    }
    candidato = candidato + 1;
  }
  if (factores === "") factores = "No hay factores primos.";

  res.json({
    numero: n,
    esPrimo,
    raiz,
    residuo,
    factores
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));