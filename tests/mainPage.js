// test fixture to represent main page with 
const { _electron: electron } = require('playwright')

exports.MainPage = class MainPage {

  constructor() {
    this.electronApp = electron.launch({ args: ['.'] })
  }

  async goto() {
    const electronApp = await this.electronApp
    this.page = await electronApp.firstWindow()
  }

  async close() {
    const electronApp = await this.electronApp
    await electronApp.close()
  }

  async title() {
    return await this.page.title()
  }

  async setup(data) {
    const db = require('../lib/init.js')
    db.mockDataSetup(data)
  }

  async getByText(text) {
    return await this.page.getByText(text)
  }
}
