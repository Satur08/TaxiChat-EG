#!/bin/bash
set -e

echo "=== Building React Web App ==="
npm run build

echo "=== Initializing Capacitor Project ==="
if [ ! -f "capacitor.config.json" ]; then
  npx cap init "Taxi GE" "com.taxige.app" --web-dir=dist
else
  echo "Capacitor already initialized."
fi

echo "=== Adding Android Platform ==="
if [ ! -d "android" ]; then
  npx cap add android
else
  echo "Android platform already added."
fi

echo "=== Configuring Android SDK Path ==="
mkdir -p android
echo "sdk.dir=/opt/android-sdk" > android/local.properties

echo "=== Syncing Web Assets to Android Project ==="
npx cap sync android

echo "=== Compiling Android Debug APK ==="
cd android
export ANDROID_HOME="/opt/android-sdk"
./gradlew assembleDebug

echo "=== Copying APK to Target Directories ==="
cd ..
mkdir -p .build-outputs
mkdir -p APK_DOWNLOAD

cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/app-debug.apk
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/app-debug.apk

echo "=== Verification ==="
ls -lh .build-outputs/app-debug.apk
ls -lh APK_DOWNLOAD/app-debug.apk

echo "=== APK Build Completed Successfully ==="
