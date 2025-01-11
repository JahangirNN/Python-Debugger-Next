"use client"; // For Next.js App Router
import { useRef } from "react";
import Editor from "@monaco-editor/react";
import React from "react";

const CodeEditor = ({ definition, code, setCode }) => {
  const editorRef = useRef(null);

  const onEditorMount = (editor) => {
    editorRef.current = editor;

    // Add lock icon decoration to the first line
    editor.deltaDecorations([], [
      {
        range: new monaco.Range(1, 1, 1, 1),
        options: {
          glyphMarginClassName: "locked-line-glyph",
          isWholeLine: true,
        },
      },
    ]);

    let isUpdatingDefinition = false;

    // Ensure the first line content remains unchanged
    editor.onDidChangeModelContent((event) => {
      if (isUpdatingDefinition) return;

      const model = editor.getModel();
      const changes = event.changes;

      // Never uncomment this shit
      // const firstLineChanged = changes.some(
      //   (change) =>
      //     change.range.startLineNumber === 1 || change.range.endLineNumber === 1
      // );

      // if (firstLineChanged) {
      //   const firstLine = model.getLineContent(1);

      //   if (firstLine !== definition) {
      //     isUpdatingDefinition = true;
      //     model.applyEdits([
      //       {
      //         range: new monaco.Range(1, 1, 1, firstLine.length + 1),
      //         text: definition,
      //       },
      //     ]);
      //     isUpdatingDefinition = false;
      //   }
      // }
    });

    // Redirect mouse clicks on the first line
    editor.onMouseDown((event) => {
      if (event.target.position && event.target.position.lineNumber === 1) {
        editor.setPosition({ lineNumber: 2, column: 1 });
      }
    });

    // Prevent cursor placement on the first line
    editor.onDidChangeCursorPosition((event) => {
      if (event.position.lineNumber === 1) {
        editor.setPosition({ lineNumber: 2, column: 1 });
      }
    });

    // Prevent Backspace on the first line
    editor.onKeyDown((e) => {
      if (e.code === "Backspace") {
        const position = editor.getPosition();
        const model = editor.getModel();
        const lineContent = model.getLineContent(position.lineNumber);

        // Prevent Backspace when on the first line
        if (position.lineNumber === 1 || (position.column === 1 && lineContent.trim() !== "")) {
          e.preventDefault();
        }
      }
    });
  };

  return (
    <div className="editor-container bg-transparent border-2 border-gray-600 rounded-xl overflow-hidden shadow-xl mb-6 hover:ring-4 hover:ring-blue-500 transition-all duration-300 w-full flex flex-col">
      <style jsx>{`
        .locked-line-glyph {
          background: url("https://img.icons8.com/ios-filled/50/000000/lock-2.png")
            no-repeat center center;
          background-size: contain;
          width: 18px;
          height: 18px;
        }

        .monaco-editor {
          border-radius: 8px;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
          border: 1px solid #333;
        }

        .monaco-editor .monaco-editor-background {
          background-color: #2e2e2e !important;
        }

        .monaco-editor .glyph-margin {
          width: 24px;
        }

        .monaco-editor .line-numbers {
          color: #aaa;
        }

        .monaco-editor .cursor {
          border-left: 2px solid #00d6ff;
        }
      `}</style>

      <Editor
        height="450px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        onMount={onEditorMount}
        options={{
          fontSize: 16,
          scrollBeyondLastLine: false,
          cursorSmoothCaretAnimation: true,
          glyphMargin: true,
          wordWrap: "on",
          minimap: {
            enabled: false,
          },
          lineNumbers: "on",
        }}
      />
    </div>
  );
};

export default CodeEditor;
