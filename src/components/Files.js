import React, { useEffect } from "react";

export function Files() {
  const [query ,setQuery] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [message, setMessage] = React.useState('No files found');
  async function search(query) {
    try {
      const response = await window.electron.getFiles(query);
      setFiles(response);
    } catch (err) {
      console.log(err);
      setFiles([])
      setMessage('Please select a directory')
    }
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
      {files? (<table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Matched Text</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => {
            return (
              <tr key={index}>
                <td>{file.title}</td>
                <td>{file.matched_text}</td>
              </tr>
            )
          })}
        </tbody>
      </table>) : <p>{message}</p>}
    </div>
  );
}