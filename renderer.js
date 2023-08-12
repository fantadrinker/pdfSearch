
async function getFile() {
  // Open file picker and destructure the result the first handle
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  return file;
}

async function ping() {
  const result = await window.electron.ping();
  console.log(result);
  const resultEl = document.getElementById('ping-result')
  if (resultEl) resultEl.innerText = result;
}

document.getElementById('ping-button').addEventListener('click', ping);

document.getElementById('file-button').addEventListener('click', async () => {
  //const file = await getFile();
  const result = await window.electron.getFiles();
  console.log(result);
  const fileEl = document.getElementById('file-result')
  if (fileEl) fileEl.innerText = result;
});

/*
async function readFile(file) {
  try {
    const data = await pdf(file)
    return data
  } catch (err) {
    console.log(err)
  }
}
*/