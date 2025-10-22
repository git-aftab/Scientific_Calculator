import React, { useEffect, useState } from "react";
import { Delete, Divide } from "lucide-react";

const App = () => {
  const [display, setdisplay] = useState("0");
  const [memory, setMemory] = useState("");
  const [isRadian, setIsRadian] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        handleKeyPress(key);
      } else if (key === "+" || key === "-") {
        handleOperator(key === "-" ? "-" : "+");
      } else if (key === "*") {
        handleOperator("×");
      } else if (key === ".") {
        handleNumber(".");
      } else if (key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (key === "Escape" || key === "c" || key === "C") {
        handleClear(); // clear
      } else if (key === "Backspace") {
        handleBackspace(); // backspace
      } else if (key === "(") {
        handleOperator("("); // parenthesis
      } else if (key === ")") {
        handleOperator(")"); // parenthesis
      } else if (key === "%") {
        handleOperator("%"); // percent
      } else if (key === "s") {
        handleOperator("sqrt"); // Square root
      } else if (key === "p") {
        handleOperator("π"); // pi value
      } else if (key === "e") {
        handleOperator("e"); // Euler's numbeer
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display]);

  const calculate = (expr) => {
    try {
      let processed = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, Math.PI)
        .replace(/e(?!xp)/g, Math.E);

      processed = processed.replace(/(\d+)!/g, (match, num) => {
        let n = parseInt(num);
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      });
      return eval(processed);
    } catch {
      return "Error";
    }
  };

  const handleNumber = (num) => {
    setdisplay((prev = prev === "0" || prev === "Error" ? num : prev + num));
  };
  const handleOperator = (op) => {
    setdisplay((prev) => (prev === "Error" ? "0" : prev + op));
  };

  const handleFunction = (func) => {
    try {
      const val = parseFloat(display);
      let result;
      const angle = isRadian ? val : (val * Math.PI) / 180;

      switch (func) {
        case "sin":
          result = Math.sin(angle);
          break;
        case "cos":
          result = Math.cos(angle);
          break;
        case "tan":
          result = Math.tan(angle);
          break;
        case "asin":
          result = Math.asin(val);
          if (isRadian) result *= 180 / Math.PI;
          break;
        case "acos":
          result = Math.acos(val);
          if (isRadian) result *= 180 / Math.PI;
          break;
        case "atan":
          result = Math.atan(val);
          if (isRadian) result *= 180 / Math.PI;
          break;
        case "sinh":
          result = Math.sinh(val);
          break;
        case "cosh":
          result = Math.cosh(val);
          break;
        case "tanh":
          result = Math.tan(val);
          break;
        case "log":
          result = Math.log10(val);
          break;
        case "ln":
          result = Math.log(val);
          break;
        case "sqrt":
          result = Math.sqrt(val);
          break;
        case "square":
          result = val * val;
          break;
        case "cube":
          result = val * val * val;
          break;
        case "exp":
          result = Math.exp(val);
          break;
        case "abs":
          result = Math.abs(val);
          break;
        case "inv":
          result = 1 / val;
          break;
        case "fact":
          let n = Math.floor(val);
          result = 1;
          for (let i = 2; i <= n; i++) result += i;
          break;
        default:
          return;
      }
      setdisplay(String(result));
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl"></div>
    </div>
  )
};

export default App;
