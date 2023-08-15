### Installation

Go to [releases](https://github.com/fantadrinker/pdfSearch/releases) to 
find the latest release, and download the corresponding 
installer for your environment/os, for example here are some tested 
operating systems:
|    OS  | installer |
| ------ | --------- |
| Windows | \<name>-\<version>.Setup.exe |
| MacOS | \<name>-darwin-x64-\<version>.zip |
| Linux | \<name>_\<version>_amd64.deb |

### Usage

After successful installation, open the application, then you will see 
an interface prompting you to select a directory. click on the button 
and select a directory that contains the pdfs you want to search. 

Note: currently only supports flat structure, any pdfs nested inside 
a directory within the selected directory will not be searched.

After directory is loaded, type words in the search input box to search for the 
text within all the pdfs. 

### Development

After downloading/cloning the repo, run 
```
npm install
```
to install dependencies.

 To build and run locally with hot-reload, run 
```
npm run servejs
```
in one terminal window to start local hot reload dev server, then run 

```
npm run start
``` 
in another terminal to start the electron main process


### Plans


1. [playwright done] Research and add CI/CD pipeline?
    - write some tests
2. [done] Let user choose working directory
3. [done] Flush local database at start
4. Open file handle on click
5. [done] Set up fts5 with sqlite
6. more debugging/error display/log dump
7. UI improvement