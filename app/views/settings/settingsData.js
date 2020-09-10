// import { Settings } from './settings.view';
import Locale from 'utils/locale';
import { defaultNavStyles } from 'styles';

const getSettingsData = () => ({
  links: [
    {
      title: 'profile',
      data: [
        {
          key: 'profile',
          viewType: 'link',
          onPressType: 'push',
          label: Locale.translate('setting.activeProfile'),
          pressParams: {
            title: Locale.translate('setting.activeProfile'),
            screen: 'CopartTransporter.Settings.ProfileSelection',
            navigatorStyle: defaultNavStyles,
            animationType: 'slide-horizontal',
            passProps: {
              retrieveUserInfo: true,
            },
          },
        },
        {
          key: 'changepw',
          viewType: 'touchable',
          onPressType: 'modal',
          label: Locale.translate('setting.changePassword'),
          pressParams: {
            label: 'ChangePassword',
            screen: 'CopartTransporter.ChangePassword',
            title: Locale.translate('setting.changePassword'),
            navigatorStyle: defaultNavStyles,
            animationType: 'slide-horizontal',
            overrideBackPress: true,
          },
          path: '/Settings',
        },
      ],
    },
    {
      title: 'local',
      data: [
        {
          key: 'country',
          viewType: 'fixedData',
          onPressType: 'none',
          label: Locale.translate('setting.country'),
          value: 'US',
          navigationKey: '',
        },
        {
          key: 'language',
          viewType: 'link',
          onPressType: 'push',
          label: Locale.translate('setting.language'),
          pressParams: {
            label: 'Language',
            screen: 'CopartTransporter.Settings.Languages',
            title: Locale.translate('setting.language'),
            navigatorStyle: defaultNavStyles,
            animationType: 'slide-horizontal',
          },
        },
      ],
    },
    {
      title: 'buttons',
      data: [
        {
          key: 'ToolTip',
          viewType: 'button',
          onPressType: 'custom',
          buttonLabel: 'Reset',
          label: Locale.translate('setting.tooltip'),
        },
        {
          key: 'Onboarding',
          viewType: 'touchable',
          onPressType: 'modal',
          label: Locale.translate('setting.onboarding'),
          pressParams: {
            label: 'Onboarding',
            screen: 'CopartTransporter.Onboarding',
          },
        },
        {
          key: 'Terms',
          viewType: 'touchable',
          onPressType: 'modal',
          label: Locale.translate('setting.Terms'),
          pressParams: {
            screen: 'CopartTransporter.TermsAndConditions',
            passProps: { buttonType: 'Dismiss' },
          },
        },
      ],
    },
    {
      title: 'appVer',
      data: [
        {
          key: 'version',
          viewType: 'fixedData',
          label: Locale.translate('setting.appVersionCode'),
          value: '1.0',
          path: '/Settings',
          navigationKey: '',
          localizedString: 'setting.appVersionCode',
        },
      ],
    },
  ],
  isAuthRequired: true,
});

export default getSettingsData;
