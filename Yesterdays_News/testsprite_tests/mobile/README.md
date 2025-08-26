# Yesterday's News - Mobile Testing Suite

Bu klasör, Yesterday's News React Native uygulaması için mobil platformlarda (iOS/Android) test yapmak üzere hazırlanmış TestSprite testlerini içerir.

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+
- React Native CLI
- Xcode (iOS için)
- Android Studio (Android için)
- Detox CLI

### Kurulum Adımları

1. **Detox kurulumu:**
```bash
npm install -g detox-cli
```

2. **Bağımlılıkları yükleyin:**
```bash
cd testsprite_tests/mobile
npm install
```

3. **iOS için ek kurulum:**
```bash
cd ios
pod install
cd ..
```

4. **Android için ek kurulum:**
```bash
# Android SDK ve emulator kurulumu
# Android Studio üzerinden gerekli SDK'ları yükleyin
```

## 📱 Test Konfigürasyonu

### Detox Konfigürasyonu
`detox.config.js` dosyası aşağıdaki konfigürasyonları içerir:

- **iOS Simulator (Debug/Release)**
- **Android Emulator (Debug/Release)**
- **Bağlı Android Cihaz**

### Platform Seçimi
Testleri farklı platformlarda çalıştırmak için:

```bash
# iOS Simulator
npm run test:ios

# Android Emulator
npm run test:android

# Bağlı Android Cihaz
npm run test:android-attached

# Her iki platformda
npm run e2e
```

## 🧪 Test Dosyaları

### Mevcut Testler

1. **TC001_Mobile_App_Launch_and_Splash_Screen_Display.js**
   - Uygulama başlatma ve splash screen testi
   - Gear animasyonu kontrolü
   - Performans testleri

2. **TC002_Mobile_Fetch_Current_Date_Historical_Events.js**
   - Tarihsel olayları getirme testi
   - Offline mod ve cache testi
   - Pull-to-refresh testi

3. **TC006_Mobile_Language_Selector_Dynamic_Update.js**
   - Dil değiştirici testi
   - 11 dil desteği testi
   - RTL dil desteği testi

4. **TC007_Mobile_Event_Card_Display_and_Category_IconColor_Coding.js**
   - Event card görüntüleme testi
   - iOS/Android platform testi
   - Ekran boyutu ve yön testi

5. **TC008_Mobile_Event_Card_Tapping_Opens_MagnifyingGlassModal.js**
   - Modal açma/kapama testi
   - Gesture testleri
   - App lifecycle testi

6. **TC010_Mobile_General_Error_Handling.js**
   - Genel hata yönetimi testi
   - Retry mekanizması testi
   - Fallback UI testi

## 🔧 Test Çalıştırma

### Temel Test Çalıştırma
```bash
# Tüm testleri çalıştır
npm run e2e

# Sadece iOS testleri
npm run test:ios

# Sadece Android testleri
npm run test:android
```

### Belirli Test Çalıştırma
```bash
# Belirli test dosyasını çalıştır
detox test --configuration ios.sim.debug --grep "App Launch"

# Belirli test suite'ini çalıştır
detox test --configuration android.emu.debug --grep "Event Card"
```

### Debug Modunda Test
```bash
# Debug modunda test çalıştır
detox test --configuration ios.sim.debug --loglevel trace
```

## 📊 Test Sonuçları

### Test Raporları
Testler tamamlandıktan sonra sonuçlar şu şekilde görüntülenir:

- **Console output**: Terminal'de test sonuçları
- **Detox logs**: Detaylı test logları
- **Screenshots**: Hata durumlarında otomatik screenshot'lar

### Test Metrikleri
- Test sayısı: 20+
- Platform desteği: iOS, Android
- Test türleri: UI, Performance, Error Handling, Accessibility

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **iOS Simulator Açılmıyor:**
```bash
# Simulator'ı manuel açın
open -a Simulator
```

2. **Android Emulator Açılmıyor:**
```bash
# Emulator'ı manuel açın
emulator -avd Pixel_4_API_30
```

3. **Build Hataları:**
```bash
# Cache'i temizleyin
npm run clean
detox clean-framework-cache
```

4. **Test Timeout:**
```bash
# Timeout süresini artırın
jest.setTimeout(180000)
```

### Debug İpuçları

- `--loglevel trace` ile detaylı loglar
- `--record-logs all` ile tüm logları kaydet
- `--take-screenshots all` ile tüm screenshot'ları al

## 📱 Platform Özellikleri

### iOS Özellikleri
- Simulator desteği
- Gesture testleri
- Orientation testleri
- Accessibility testleri

### Android Özellikleri
- Emulator desteği
- Fiziksel cihaz desteği
- Multi-touch testleri
- Performance testleri

## 🔄 CI/CD Entegrasyonu

### GitHub Actions
```yaml
- name: Run Mobile Tests
  run: |
    cd testsprite_tests/mobile
    npm run e2e
```

### Jenkins
```groovy
stage('Mobile Testing') {
    steps {
        sh 'cd testsprite_tests/mobile && npm run e2e'
    }
}
```

## 📚 Ek Kaynaklar

- [Detox Documentation](https://github.com/wix/Detox)
- [React Native Testing](https://reactnative.dev/docs/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 🤝 Katkıda Bulunma

1. Test dosyalarını güncelleyin
2. Yeni test senaryoları ekleyin
3. Platform-specific testler ekleyin
4. Test coverage'ı artırın

## 📞 Destek

Sorunlar için:
- GitHub Issues kullanın
- Detox community'ye danışın
- React Native forum'larına başvurun
