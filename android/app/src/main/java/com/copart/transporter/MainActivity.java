package com.copart.transporter;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback;
import com.facebook.react.modules.core.PermissionListener;

import io.fabric.sdk.android.Fabric;

// public class MainActivity extends ReactActivity {
public class MainActivity extends SplashActivity implements OnImagePickerPermissionsCallback {
    private PermissionListener listener;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            Fabric.with(this, new Crashlytics());
        }catch (Exception e) {

        }
    }

    @Override
    public View createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        view.setGravity(Gravity.CENTER);
        view.setBackgroundResource(R.mipmap.splash);
        return view;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // @Override
    // protected String getMainComponentName() {
    //     return "CopartTransporter";
    // }
    @Override
    public void setPermissionListener(PermissionListener listener) {
        this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (listener != null) {
            listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
