"use client";
import { useState } from "react";
import { Analyse } from "./components/Analyse";
import { Login } from "./components/Login";
import { Trainer } from "./components/Trainer";
import { TypeSelection } from "./components/TypeSelection";
import { AnalyseResult } from "./types/result";

function TestTool() {
  const [showLogin, setShowLogin] = useState(true);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [showTrainer, setShowTrainer] = useState(false);
  const [showAnalyse, setShowAnalyse] = useState(false);
  const [result, setResult] = useState<AnalyseResult>();
  const [text, setText] = useState<string>();

  return (
    <div className="test-tool">
      {showLogin && (
        <Login
          onLogin={() => {
            setShowLogin(false);
            setShowTypeSelection(true);
          }}
        />
      )}
      {showTypeSelection && (
        <TypeSelection
          onSelect={(selection) => {
            setShowTypeSelection(false);
            setShowTrainer(true);
          }}
        />
      )}
      {showTrainer && (
        <Trainer
          onSubmit={(res, text) => {
            setShowTrainer(false);
            setShowAnalyse(true);
            setResult(res);
            setText(text);
          }}
        />
      )}
      {showAnalyse && text && <Analyse text={text} result={result} />}
    </div>
  );
}

export default TestTool;
