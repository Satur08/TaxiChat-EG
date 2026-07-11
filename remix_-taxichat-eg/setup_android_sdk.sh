#!/bin/bash
set -e

echo "=== Starting Android SDK Setup ==="

# Define directories
export ANDROID_HOME="/opt/android-sdk"
mkdir -p "$ANDROID_HOME/cmdline-tools"

# Download command line tools (stable version 11076708)
echo "Downloading Android Command Line Tools..."
wget -q "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -O /tmp/cmdline-tools.zip

echo "Extracting tools..."
unzip -q /tmp/cmdline-tools.zip -d "$ANDROID_HOME/cmdline-tools"
rm /tmp/cmdline-tools.zip

# Re-structure to "latest" to satisfy sdkmanager requirements
echo "Re-structuring directory to 'latest'..."
mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"

# Export paths
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

# Accept licenses
echo "Accepting Android licenses..."
yes | sdkmanager --licenses --sdk_root="$ANDROID_HOME"

# Install platform, build-tools and platform-tools
echo "Installing platforms;android-34 and build-tools;34.0.0..."
sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "=== Android SDK Setup Completed Successfully ==="
