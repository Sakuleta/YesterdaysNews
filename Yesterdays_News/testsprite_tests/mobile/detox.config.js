module.exports = {
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YesterdaysNews.app',
      build: 'xcodebuild -workspace ios/YesterdaysNews.xcworkspace -scheme YesterdaysNews -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/YesterdaysNews.app',
      build: 'xcodebuild -workspace ios/YesterdaysNews.xcworkspace -scheme YesterdaysNews -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..'
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..'
    }
  },
  devices: {
    'ios.simulator': {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
        os: 'iOS 16.0'
      }
    },
    'android.emulator': {
      type: 'android.emulator',
      device: {
        avdName: 'Galaxy_S25_Ultra'
      }
    },
    'android.attached': {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'ios.simulator',
      app: 'ios.debug'
    },
    'ios.sim.release': {
      device: 'ios.simulator',
      app: 'ios.release'
    },
    'android.emu.debug': {
      device: 'android.emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'android.emulator',
      app: 'android.release'
    },
    'android.attached': {
      device: 'android.attached',
      app: 'android.debug'
    }
  }
};
