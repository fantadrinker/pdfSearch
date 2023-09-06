import React, { useEffect } from "react";

export function Files() {
  const [query ,setQuery] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('No files found');
  async function search(query) {
    try {
      const response = await window.electron.getFiles(query);
      setFiles(response);
      setLoading(false)
    } catch (err) {
      console.log(err);
      setFiles([])
      setMessage('Please select a directory')
    }
  }

  function openFile(path) {
    if (!path) return;
    window.electron.openFileInFolder(path)
  }

  useEffect(() => {
    // flush result when query changes
    setLoading(true)
    if (query) {
      search(query)
    } else {
      search()
    }
  }, [query])
  return (
    <>
      <div className="mb-3">
        <label className="font-bold mr-3" for="search-query" >Search By Text:</label>
        <input id="search-query" type="text" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {loading && <p>Loading...</p>}
      {(files && !loading)? (<table className="table-fixed border-solid border-gray-400">
        <thead>
          <tr>
            <th className="w-1/4">File Name</th>
            <th className="w-3/4">Matched Text</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => {
            return (
              <tr key={`${index}_${file.path}`} data-pw="file-result" >
                <td 
                  onClick={() => openFile(file.path)}
                  className="cursor-pointer hover:underline"
                >
                  {file.title}
                </td>
                <td dangerouslySetInnerHTML={
                  {__html: file.matched_text}
                }></td>
              </tr>
            )
          })}
        </tbody>
      </table>) : <p>{message}</p>}
    </>
  );
}