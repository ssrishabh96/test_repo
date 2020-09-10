package com.copart.transporter;

import android.app.Application;
import android.support.annotation.Nullable;

import com.reactnativenavigation.NavigationApplication;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.microsoft.codepush.react.CodePush;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.eguma.barcodescanner.BarcodeScannerPackage;
import com.yoloci.fileupload.FileUploadPackage;
import io.realm.react.RealmReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication implements ReactInstanceHolder {

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                //if needed: new YourPackageHere()
                new MainReactPackage(),
                new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                new RNDeviceInfo(), new BarcodeScannerPackage(), new FileUploadPackage(), new RealmReactPackage(),
                new ImagePickerPackage(), new RNFirebasePackage(), new RNFirebaseMessagingPackage(),
                new RNFirebaseDatabasePackage(), new RNFSPackage(), new RSSignatureCapturePackage(), new MapsPackage(),
                new LinearGradientPackage());
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    @Nullable
    @Override
    public String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Nullable
    @Override
    public String getJSMainModuleName() {
        return "index";
    }

    @Override
    public ReactInstanceManager getReactInstanceManager() {
        // CodePush must be told how to find React Native instance
        return getReactNativeHost().getReactInstanceManager();
    }
}
