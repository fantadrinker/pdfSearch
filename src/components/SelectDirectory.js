import React from "react";

export function SelectDirectory() {
  const [directory, setDirectory] = React.useState('');

  async function selectDirectory() {
    const response = await window.electron.selectDirectory();
    setDirectory(response);
  }
  return (
    <div>
      <h1>Select Directory</h1>
      {directory && <p>Current directory: {directory}</p>}
      <button 
        className="btn btn-primary"
        onClick={selectDirectory}
      >
        {directory? 'Change': 'Select'} Directory
      </button>
    </div>
  );
}