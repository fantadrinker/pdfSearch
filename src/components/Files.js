import React, { useEffect } from "react";

export function Files() {
  const [query ,setQuery] = React.useState('');
  const [files, setFiles] = React.useState([]);
  async function search(query) {
    const response = await window.electron.getFiles(query);
    console.log(files)
    setFiles(response);
  }
  useEffect(() => {
    if (query) {
      search(query)
    } else {
      search()
    }
  }, [query])
  return (
    <div>
      <h1>Files</h1>
      <div>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {files && files.map((file) => <p key={file.id}>{file.title}</p>)}
    </div>
  );
}