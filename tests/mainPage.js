// test fixture to represent main page with 
const { _electron: electron } = require('playwright')

exports.MainPage = class MainPage {

  constructor() {
    this.electronApp = electron.launch({ args: ['.', '--test'], recordVideo: { dir: 'test-results' } })
  }

  async goto() {
    const electronApp = await this.electronApp
    this.page = await electronApp.firstWindow()
  }

  async close() {
    const electronApp = await this.electronApp
    await electronApp.close()
  }

  title() {
    return this.page.title()
  }

  getByText(text) {
    return this.page.getByText(text)
  }

  getByLabelText(text) {
    return this.page.getByLabel(text)
  }

  pageLocator(xpath){
    return this.page.locator(xpath)
  }

  screenshot(options) {
    return this.page.screenshot(options)
  }
}
