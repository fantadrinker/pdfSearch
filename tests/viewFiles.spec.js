// this test makes sure if database is correctly setup, 
// user is able to see all the files in the directory, 
// up to 10 files

const { test, expect } = require('@playwright/test')
const { MainPage } = require('./mainPage.js')
const { mockDataSetup } = require('./testlib/mockDB')

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
  // TODO: move to fixtures https://playwright.dev/docs/test-fixtures
  let mainPage

  test.beforeEach(async () => {
    await mockDataSetup(mockData)
    mainPage = new MainPage()
    await mainPage.goto()
    await mainPage.title()
  })

  test.afterEach(async () => {
    await mainPage.close()
  })

  test('list and query file text, should show pdf file only', async () => {
    // TODO: assert the right stuff here
    // Wait for the first BrowserWindow to open
    // and return its Page object
    expect(await mainPage.title()).toBe('PDF Search')

    const resultRow = await mainPage.pageLocator('tr[data-pw="file-result"]')
    expect(resultRow).toHaveCount(2)
    const searchBox = await mainPage.getByLabelText('Search By Text')
    expect(searchBox).toBeTruthy()

    await searchBox.fill('test')
    expect(resultRow).toHaveCount(1)
    expect(resultRow).toContainText('file.pdf') // TODO: narrow down to the right cell

    await searchBox.fill('document')

    expect(resultRow).toHaveCount(1)
    expect(resultRow).toContainText('some_doc.docx') // TODO: narrow down to the right cell
  })

  test.skip('open file', () => {
    // mock open file handle

    // click on file

    // assert open file function is called
  })
})