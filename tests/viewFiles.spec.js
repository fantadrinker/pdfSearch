// this test makes sure if database is correctly setup, 
// user is able to see all the files in the directory, 
// up to 10 files

const { test, expect } = require('@playwright/test')
const { MainPage } = require('./mainPage.js')

const mockData = [
  {
    path: 'nested/file.pdf',
    content: 'this is a test file',
    title: 'file.pdf'
  },
  {
    path: 'some_doc.docx',
    content: 'this is a word document',
    title: 'some_doc.docx'
  }
]

test.describe('view files', () => {
  let mainPage

  test.beforeEach(async () => {
    mainPage = new MainPage()
    await mainPage.goto()
    await mainPage.setup(mockData)
  })

  test.afterEach(async () => {
    await mainPage.close()
  })

  test('view files', async () => {
    // TODO: assert the right stuff here
    // Wait for the first BrowserWindow to open
    // and return its Page object
    expect(await mainPage.title()).toBe('PDF Search')
    expect(await mainPage.getByText('file.pdf')).toBeTruthy()
    expect(await mainPage.getByText('some_doc.docx')).toBeTruthy()

  })

  test('view files with query', async () => {
    expect(1).toBeTruthy()
  })

  test('open file', () => {
    expect(1).toBeTruthy()
  })
})