module.exports = {
  packagerConfig: {
    asar: true,
    
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'fantadrinker',
          name: 'pdfSearch'
        },
        prerelease: false,
        draft: false
      }
    }
  ],
  hooks: {
    packageAfterPrune: async (_config, buildPath) => {
      const gypPath = path.join(
        buildPath,
        'node_modules',
        'moduleName',
        'build',
        'node_gyp_bins'
      );
      await fs.rm(gypPath, {recursive: true, force: true});
   }
 }
};
