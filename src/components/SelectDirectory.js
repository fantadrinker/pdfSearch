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
      <button 
        className="btn btn-primary"
        onClick={selectDirectory}
      >
        Select Directory
      </button>
      {directory && <p>{directory}</p>}
    </div>
  );
}