"use client"; // For Next.js App Router
import { useEffect, useRef, useState } from "react";
import CodeEditor from "./components/editor";
import ButtonWithTimer from "./components/nextButton";
import CountdownWithSkip from "./components/nextButton";

export default function PythonEditor() {
  const [key, setKey] = useState(0); // Key to force re-render
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [syntaxError, setSyntaxError] = useState("");
  const [id, setId] = useState("1");
  const [result, setResult] = useState();
  const [solved, setSolved] = useState(false);

  

  // const challengeDescription = `Debug the following Python function. It should return the sum of two numbers, but it currently contains errors. Fix the errors to make it work correctly.`;

  useEffect(() => {
    const getCodeFromApi = async () => {
      setLoading(true)
      try {
        // const response = await fetch(`http://127.0.0.1:8000/code/get_code?id=${id}`, {
        const response = await fetch(`https://python-debugger-fastapi.onrender.com/code/get_code?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }        
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setResult( await response.json());
        setKey((prevKey) => prevKey + 1); // Update key to remount CodeEditor
      } catch (err) {
        console.log(err);
      }
      setLoading(false)
    };

    getCodeFromApi(); // Call the function to execute it
  }, [id]); // This will trigger when 'id' or 'code' changes

  useEffect(()=>{
    setCode(result?.code); // Store the result in state
    
  }, [result])
  // const editorRef = useRef(null);

  // const functionDefinition = "def add_numbers(a, b):"; // Keep this dynamic as needed.
  



  const runCode = async () => {
    setLoading(true);
    setTestResults([]);
    setSyntaxError("");

    // Syntax validation
    try {
      const syntax = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({code} ),
      });
      const syntaxResult = await syntax.json();

      if (syntaxResult.error) {
        setSyntaxError(syntaxResult.error);
        return;
      }

      // Test code execution
      const testCasesFormatted = [
        { input: "add_numbers(2, 3)", expected: 5 },
        { input: "add_numbers(-1, 4)", expected: 3 },
        { input: "add_numbers(0, 0)", expected: 0 },
      ];

      // const response = await fetch("http://127.0.0.1:8000/test/test_code", {
      const response = await fetch("https://python-debugger-fastapi.onrender.com/test/test_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, test_cases: result?.test_cases }),
      });

      const output = await response.json();
      setTestResults(output.results);
      output.results.forEach(element => {
        setSolved(element.status == 'Failed'? false : true)
      });
    } catch (error) {
      console.log(error)
      setSyntaxError("Error: Unable to process the code.");
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    setCode(
      result?.code
    );
    setSyntaxError("");
    setTestResults([]);
    setKey((prevKey) => prevKey + 1); // Update key to remount CodeEditor

  };
  const handleComplete = () => {
    console.log("Countdown complete or skipped!");
    setTestResults([]);
    setSyntaxError("");
    setSolved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 p-6 transition-all duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Section */}
        <div className="flex flex-col space-y-8">
          <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">
            Start Debugging 
          </h1>
  

          {syntaxError && (
            <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-xl font-bold">Syntax Error:</h2>
              <p>{syntaxError}</p>
            </div>
          )}
  
          {!syntaxError && testResults.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 bg-opacity-90">
              <h2 className="text-xl font-bold text-white">Test Results:</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                {testResults.map((result, index) => (
                  <li
                    key={index}
                    className={`${
                      result.status === "Passed"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <strong>Test Case {result.test_case}:</strong>{" "}
                    {result.status === "Passed" ? (
                      <span>Passed - Result: {result.result}</span>
                      
                    ) : (
                      <span>                        
                        Failed - Expected: {result.expected}, Got: {result.got}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {solved? 
          <CountdownWithSkip onComplete={handleComplete} setId={setId}/>:
            <>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg bg-opacity-90">
                <h2 className="text-xl font-semibold text-white mb-2">Hint: 💡</h2>
                <pre className="text-gray-300 whitespace-pre-wrap break-words">
                  {result?.hint}
                </pre>
              </div>
              <div className="p-4 rounded-xl bg-opacity-90 bg-gray-800 shadow-lg">
                <h5 className="text-2xl font-extrabold text-gray-100 tracking-wide">
                  STREAK 🚀: <span className="text-green-400 text-3xl">{parseInt(id) - 1}</span>
                </h5>
              </div>

            </>
          }
          {/* <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center"> */}
            {/* <CountdownWithSkip onComplete={handleComplete} /> */}
          {/* </div> */}
  
        </div>
  
        {/* Right Section */}
        <div className="flex flex-col space-y-6">
          <div className="flex-1">
            <CodeEditor
              definition={result?.code.split("\n")[0]}
              code={code}
              setCode={setCode}
              key={key}
            />
          </div>
  
          <div className="flex justify-between mt-4 space-x-4">
            <button
              onClick={runCode}
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-500"
              }`}
            >
              {loading ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={resetCode}
              className="w-full py-3 font-semibold bg-gray-700 text-white rounded-lg transition-all duration-300 hover:bg-gray-600"
            >
              Reset Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}
