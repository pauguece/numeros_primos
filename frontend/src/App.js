import { useState } from "react";
import axios from "axios";
import "./App.css";

function calcularDatos(n) {
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

  // --- Divisores enteros ---
  let divisores = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divisores.push(i);
  }

  return {
    numero: n,
    esPrimo,
    raiz,
    residuo,
    factores: factores.length > 0 ? factores.join(" ") : "No hay factores primos.",
    divisores: divisores.length > 0 ? divisores.join(" ") : "No tiene divisores enteros."
  };
}


function App() {
  const [numero, setNumero] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const calcular = async () => {
    setError("");
    setResultado(null);

    if (numero === "") {
      setError("Por favor, ingresa un número.");
      return;
    }

    if (numero.length > 8) {
      setError("El número no puede tener más de 8 dígitos.");
      return;
    }

    if (parseInt(numero) <= 1) {
      setError("El número debe ser mayor a 1, debido a que el 1 y el 0 no son números primos ni números compuestos.");
      return;
    }

    try {
      //const res = await axios.post("http://localhost:5000/api/calcular", {
      /*const res = await axios.post("/api/calcular", {
        numero: parseInt(numero),
      });*/

      const res = calcularDatos(parseInt(numero));
      setResultado(res);
      //setResultado(res.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Hubo un error al procesar el número");
      }
    }
  };

  const limpiar = () => {
    setNumero("");
    setResultado(null);
    setError("");
  };

  return (
    <div className="App">
      <h1>Calculadora de Números Primos</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Ingresa un número"
          value={numero}
          onKeyDown={(e) => {
            if (
              !(
                (e.key >= "0" && e.key <= "9") ||
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Tab"
              )
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor.length <= 8) setNumero(valor);
          }}
        />

        <button onClick={calcular}>Calcular</button>
        <button onClick={limpiar} className="btn-limpiar">Limpiar</button>
      </div>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="resultado">
          <p><strong>Número:</strong> {resultado.numero}</p>
          <p><strong>¿Es primo?:</strong> {resultado.esPrimo ? "Sí" : "No"}</p>
          <p><strong>Raíz cuadrada entera:</strong> {resultado.raiz}</p>
          <p><strong>Residuo:</strong> {resultado.residuo}</p>
          <p><strong>Factores primos ≤ raíz:</strong> {resultado.factores}</p>
          {!resultado.esPrimo && (
            <p><strong>Es número COMPUESTO porque es divisible entre:</strong> {resultado.divisores}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
