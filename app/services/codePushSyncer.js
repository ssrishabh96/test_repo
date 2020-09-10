import codePush from 'react-native-code-push';

const codePushOptions = {
  updateDialog: {
    appendReleaseDescription: true,
    // to display the release description set while executing code push
  },
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export const requestCodePushSync = () => codePush.sync(codePushOptions);
