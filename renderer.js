
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
  const fileEl = document.getElementById('file-result')
  if (fileEl) {
    result.forEach(({title, content}) => {
      const preview = content.split('\n').slice(0, 5).join('\n')
      const div = document.createElement('div');
      div.innerHTML = `<h3>${title}</h3><p>${preview}</p>`
      fileEl.appendChild(div);
    })
  }
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