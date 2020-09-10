# Copart Transporter Mobile

[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

### Basic

To start the packager:

```
npm start
```

or

```
yarn start
```

To run the application, make sure you have emulators running or a device connected (in developer mode):

```
react-native run-ios
react-native run-android
```

## Deployment

    Please refer the [deployment guide](docs/deployment.md)

## Debugging

### React

For debugging with `react-native`, we need to install the standalone version of [react-devtool](https://github.com/facebook/react-devtools/tree/master/packages/react-devtools)
usage
Install the react-devtools package globally:

```
npm install -g react-devtools
```

Now run react-devtools from the terminal to launch the standalone DevTools app:

```
react-devtools
```

### Redux

To use the chrome-redux-dev-tools for react-native,
<br>we run `remotedev` server locally which can be used to launch and view the redux-dev-tool at `localhost:8000`

```
npm run remotedev
```

### Recommended VS-Code settings

It is recommend that you have _at least_ the below workspace settings if you are using Visual Studio Code.

```
{
	"window.zoomLevel": 0,
	"extensions.ignoreRecommendations": false,

	"workbench.colorTheme": "Atom One Dark",
	"workbench.iconTheme": "vscode-icons",
	"workbench.panel.location": "right",

	"editor.formatOnSave": false,
	"editor.tabSize": 2,

	"prettier.useTabs": true,
	"prettier.eslintIntegration": true,

	"javascript.format.enable": false, // For Prettier
	"javascript.validate.enable": false, // For Flow
	"flow.useNPMPackagedFlow": true // Use Flow from node_modules
}
```

### Prettier

The project uses prettier for code formatting and fixing lint errors. `prettier` is linked to pre-commit hooks, so that it will run automatically on the staged files.

To run prettier separately, use `npm run prettier`

### Navigation

The project uses `React Native Navigation` for navigation.

Please refer the [docs](https://wix.github.io/react-native-navigation) for usage and more information.

### Firebase

For firebase integration, the project uses [rnfirebase](https://rnfirebase.io/docs/v3.0.*/getting-started) which provides native modules for ios and android.

### Material Switch

Please refer to the [docs](https://github.com/copartit/transporter-mobile/blob/swipe_button/app/components/core/Switch/README.md) for useage and more information.

### Testing

To run test runner, written in [jest](https://facebook.github.io/jest/)

```
npm run test:watch // to start jest and watch for changes
```

We are planning to add the `pre-push` to verify breaking changes against the test-cases.

### Contributing Guide
# test_repo
