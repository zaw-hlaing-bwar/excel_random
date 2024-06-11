import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [upload, setUpload] = useState(null)
  const [size, setSize] = useState(0)
  const [result, setResult] = useState(null)
  
  const handleFileChange = async (event) => {
    console.log("event.target.files[0]", event.target.files[0])
    // setUpload(event.target.files[0]);
    await handleFile(event.target.files[0]);
  };

  const handleFile = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    console.log("upload", file)
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      // Handle error
      console.error('Upload failed');
      return;
    }

    const data = await response.json();
    setIsLoading(false);
    setUpload(data);
    console.log('Upload successful', data);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: upload?.data?.key,
        size: size
      })
    });
    
    if (!response.ok) {
      // Handle error
      console.error('Generation failed');
      return;
    }
  
    const data = await response.json();
    setIsLoading(false);
    setResult(data.data)
    console.log('Generation successful', data);
  };

  const handleDownload = () => {
    const url = result;
    const a = document.createElement('a');
    a.href = url;
    a.click();
  };

  return (
<>
    <h1>AYA Random Generator For Olympic Winner</h1>
    <div className="card">
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />

      <h2>Input the Count</h2>
      <input type="number" placeholder="Enter a number" onChange={(event) => setSize(event.target.value)}/>
      <br/>
      <br/>
      <button onClick={handleUpload} disabled={!upload || isLoading}>
        {isLoading ? 'Loading...' : 'Upload'}
      </button>

      {result && (
        <>
          <h2>Download the Result</h2>
          <button onClick={handleDownload}>
            Download
          </button>
        </>
      )}
    </div>
  </>
  )
}

export default App
