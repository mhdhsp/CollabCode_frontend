import { useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [language, setLanguage] = useState('javascript');
  const [outPut,setOutPut]=useState("");

  const handleEditorChange = (value) => {
    setCode(value || '');
  };
  const runCode=()=>{
    setOutPut(eval(code));
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h1>Monaco Editor in React</h1>
        <label>
          Language:
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </label>
        <button
          onClick={runCode}
          style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          disabled={language !== 'javascript'} // Disable for non-JS
        >
          Run Code
        </button>
      </header>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          width="80%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            fontSize: 20,
            wordWrap: 'on',
            automaticLayout: true,
            formatOnPaste:true,
            formatOnType:true
          }}
        />
      </div>
      
      <div
          style={{
            width: '80%',
            backgroundColor: '#1e1e1e',
            color: 'white',
            padding: '10px',
            overflowY: 'auto',
            borderLeft: '1px solid #ccc',
          }}
        >
          <h3>Output</h3>
          <pre>{outPut || 'Run the code to see the output'}</pre>
        </div>
      
      <footer style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p>Code length: {code.length} characters</p>
      </footer>
    </div>
  );
}

export default CodeEditor;