import { useState } from "react";
import axios from "axios";
import "./App.css";

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

    try {
      // <-- Usamos ruta relativa para que funcione en Render
      const res = await axios.post("/api/calcular", {
        numero: parseInt(numero),
      });
      setResultado(res.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Hubo un error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="App">
      <h1>Calculadora de Números Primos</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Ingresa un número..."
          value={numero}
          onKeyDown={(e) => {
            // Bloquear teclas que no sean números
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
      </div>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="resultado">
          <p><strong>Número:</strong> {resultado.numero}</p>
          <p><strong>¿Es primo?:</strong> {resultado.esPrimo ? "Sí" : "No"}</p>
          <p><strong>Raíz cuadrada entera:</strong> {resultado.raiz}</p>
          <p><strong>Residuo:</strong> {resultado.residuo}</p>
          <p><strong>Factores primos ≤ raíz:</strong> {resultado.factores}</p>
        </div>
      )}
    </div>
  );
}

export default App;
