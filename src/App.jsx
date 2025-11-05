import React, { useState, useEffect, useCallback, useMemo } from "react";

const allButtons = [
  { label: "Rad", value: "RAD", display: "Rad", type: "mode" },
  { label: "Deg", value: "DEG", display: "Deg", type: "mode" },
  { label: "sin", value: "sin(", display: "sin(", type: "function" },
  { label: "cos", value: "cos(", display: "cos(", type: "function" },
  { label: "tan", value: "tan(", display: "tan(", type: "function" },

  { label: "log", value: "log(", display: "log(", type: "function" },
  { label: "ln", value: "ln(", display: "ln(", type: "function" },
  { label: "(", value: "(", display: "(", type: "operator" },
  { label: ")", value: ")", display: ")", type: "operator" },
  { label: "√", value: "Math.sqrt(", display: "√(", type: "function" },

  { label: "xʸ", value: "**", display: "^", type: "operator" },
  { label: "x²", value: "**2", display: "²", type: "operator" }, // Changed display to '²'
  { label: "π", value: "Math.PI", display: "π", type: "constant" },
  { label: "C", value: "CLEAR", display: "C", type: "action" },
  { label: "AC", value: "ALL_CLEAR", display: "AC", type: "action" },

  // Numpad and basic operators
  { label: "7", value: "7", display: "7", type: "number" },
  { label: "8", value: "8", display: "8", type: "number" },
  { label: "9", value: "9", display: "9", type: "number" },
  { label: "⌫", value: "BACKSPACE", display: "⌫", type: "action" },
  { label: "÷", value: "/", display: "÷", type: "operator" },

  { label: "4", value: "4", display: "4", type: "number" },
  { label: "5", value: "5", display: "5", type: "number" },
  { label: "6", value: "6", display: "6", type: "number" },
  { label: "×", value: "*", display: "×", type: "operator" },
  { label: "−", value: "-", display: "−", type: "operator" },

  { label: "1", value: "1", display: "1", type: "number" },
  { label: "2", value: "2", display: "2", type: "number" },
  { label: "3", value: "3", display: "3", type: "number" },
  { label: "+", value: "+", display: "+", type: "operator" },
  { label: ".", value: ".", display: ".", type: "number" },

  { label: "0", value: "0", display: "0", type: "number" },
  { label: "=", value: "EVALUATE", display: "=", type: "action" },
];

export default function App() {
  const [operations, setOperations] = useState([]);
  const [result, setResult] = useState("");
  const [isRadians, setIsRadians] = useState(true);
  const [memory, setMemory] = useState(0);
  const internalInput = useMemo(
    () => operations.map((op) => op.value).join(""),
    [operations]
  );
  const displayInput = useMemo(
    () => operations.map((op) => op.display).join(""),
    [operations]
  );

  const calculateResult = useCallback(() => {
    if (!internalInput) {
      setResult("");
      return;
    }

    try {
      let evalString = internalInput
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(");

      // Handle trigonometric functions based on the current angle mode
      const trigFunctions = ["sin", "cos", "tan"];
      trigFunctions.forEach((func) => {
        const regex = new RegExp(`${func}\\(`, "g");
        if (isRadians) {
          evalString = evalString.replace(regex, `Math.${func}(`);
        } else {
          // Convert degrees to radians for JS Math functions
          evalString = evalString.replace(regex, `Math.${func}((Math.PI/180)*`);
        }
      });

      // Using the Function constructor for safer evaluation than eval()
      const calculatedResult = new Function("return " + evalString)();

      if (isNaN(calculatedResult) || !isFinite(calculatedResult)) {
        setResult("Error");
      } else {
        setResult(calculatedResult.toString());
      }
    } catch (error) {
      setResult("Error");
    }
  }, [internalInput, isRadians]);

  const handleButtonClick = useCallback(
    (value, type, display) => {
      switch (value) {
        case "ALL_CLEAR":
          setOperations([]);
          setResult("");
          break;
        case "CLEAR":
          setOperations([]);
          break;
        case "BACKSPACE":
          setOperations((prev) => prev.slice(0, -1));
          break;
        case "EVALUATE":
          calculateResult();
          break;
        case "RAD":
          setIsRadians(true);
          break;
        case "DEG":
          setIsRadians(false);
          break;
        default:
          setOperations((prev) => [
            ...prev,
            { value, display: display || value },
          ]);
          break;
      }
    },
    [calculateResult]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      let buttonToClick;

      if (/[0-9]/.test(key)) {
        buttonToClick = allButtons.find((b) => b.value === key);
      } else if (key === ".") {
        buttonToClick = allButtons.find((b) => b.value === ".");
      } else if (key === "+") {
        buttonToClick = allButtons.find((b) => b.value === "+");
      } else if (key === "-") {
        buttonToClick = allButtons.find((b) => b.value === "-");
      } else if (key === "*") {
        buttonToClick = allButtons.find((b) => b.value === "*");
      } else if (key === "/") {
        buttonToClick = allButtons.find((b) => b.value === "/");
      } else if (key === "(") {
        buttonToClick = allButtons.find((b) => b.value === "(");
      } else if (key === ")") {
        buttonToClick = allButtons.find((b) => b.value === ")");
      } else if (key === "Enter" || key === "=") {
        event.preventDefault(); // Prevent default form submission
        buttonToClick = allButtons.find((b) => b.value === "EVALUATE");
      } else if (key === "Backspace") {
        buttonToClick = allButtons.find((b) => b.value === "BACKSPACE");
      } else if (key === "Escape") {
        buttonToClick = allButtons.find((b) => b.value === "ALL_CLEAR");
      } else if (
        key.toLowerCase() === "c" &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        buttonToClick = allButtons.find((b) => b.value === "CLEAR");
      }

      if (buttonToClick) {
        handleButtonClick(
          buttonToClick.value,
          buttonToClick.type,
          buttonToClick.display
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleButtonClick]);

  // CSS classes for each button based on its type
  const getButtonClass = (type) => {
    switch (type) {
      case "action":
        return "bg-blue-500 hover:bg-blue-600";
      case "operator":
        return "bg-gray-700 hover:bg-gray-600";
      case "mode":
        return "bg-indigo-500 hover:bg-indigo-600 text-sm";
      case "function":
        return "bg-gray-700 hover:bg-gray-600";
      default:
        return "bg-gray-800 hover:bg-gray-700";
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto p-4">
        <h1 className="text-4xl font-bolder text-cyan-400 mb-4 text-center tracking-wide">
          Scientific Calculator
        </h1>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden border border-white/10">
          <div className="p-6">
            <div className="p-6 text-white text-right border border-[#2e2e2e] rounded">
            <div
              className="h-10 text-xl font-light truncate "
              style={{ direction: "ltr" }}
            >
              {displayInput || "0"}
            </div>
            <div className="h-16 text-5xl font-bold truncate">{result}</div>
          </div>
            <div className="h-4 text-xs text-cyan-400 font-mono tracking-widest text-right pr-1">
              {isRadians ? "RAD" : "DEG"}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 p-4 bg-black/20">
            {allButtons.map((btn) => {
              const isEquals = btn.value === "EVALUATE";
              const isZero = btn.value === "0";

              return (
                <button
                  key={btn.label}
                  onClick={() =>
                    handleButtonClick(btn.value, btn.type, btn.display)
                  }
                  className={`
                    ${getButtonClass(btn.type)}
                    ${
                      isEquals ? "col-span-2 bg-cyan-500 hover:bg-cyan-600" : ""
                    }
                    ${isZero ? "col-span-2" : ""}
                    text-white text-xl font-semibold rounded-lg h-16 
                    flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    
                  `}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
