# 🗞️ Tarihi Gazete Teması Splash Screen

Bu dosya, "Yesterday's News" uygulaması için özel olarak tasarlanmış tarihi gazete teması splash screen'in implementasyonunu açıklar.

## ✨ Özellikler

### 🎨 **Tasarım Özellikleri**

- **Arka Plan**: Eski gazete kağıdı dokusu (#f4f1e8, #e8e0d0, #d4c4a8)
- **Logo**: Merkezde, etrafında dönen çarklar
- **Tipografi**: Playfair Display (başlık) ve Lato (alt başlık)
- **Renk Paleti**: Sepia tonları (#8B4513, #A0522D)

### 🎭 **Animasyonlar**

- Logo fade-in ve scale efekti
- Etrafında dönen çarklar (farklı hızlarda)
- Metin fade-in animasyonu
- 3 saniye sonra otomatik geçiş

### 📰 **Gazete Detayları**

- Köşelerde tarihi yıllar (1899, 1923, 1945, 1969, 1989, 2001)
- Sağ tarafta dikey haber başlıkları
- Alt kısımda kuruluş bilgileri
- Gerçekçi gazete dokusu ve lekeler

## 🚀 Kurulum

### 1. **Dependencies**

```bash
npm install expo-linear-gradient
```

### 2. **Component Yapısı**

```text
src/components/
├── NewspaperSplashScreen.js    # Ana splash screen
├── GearAnimation.js            # Dönen çark animasyonu
└── NewspaperTexture.js         # Gazete dokusu efekti
```

### 3. **App.js Entegrasyonu**

```javascript
import NewspaperSplashScreen from './src/components/NewspaperSplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  if (showSplash) {
    return <NewspaperSplashScreen onFinish={() => setShowSplash(false)} />;
  }
  
  return <HomeScreen />;
}
```

## 🎯 Kullanım

### **Props**

- `onFinish`: Splash screen tamamlandığında çağrılan callback fonksiyonu

### **Örnek Kullanım**

```javascript
<NewspaperSplashScreen 
  onFinish={() => {
    // Ana ekrana geç
    navigation.navigate('Home');
  }} 
/>
```

## 🔧 Özelleştirme

### **Renk Değişiklikleri**

```javascript
// constants.js
export const SPLASH_COLORS = {
  background: ['#f4f1e8', '#e8e0d0', '#d4c4a8'],
  primary: '#8B4513',
  secondary: '#A0522D',
  accent: '#B5915F'
};
```

### **Animasyon Süreleri**

```javascript
// NewspaperSplashScreen.js
const ANIMATION_DURATIONS = {
  logoFade: 1000,
  logoScale: 1000,
  textFade: 800,
  totalDuration: 3000
};
```

### **Çark Animasyonları**

```javascript
// GearAnimation.js
<GearAnimation 
  size={80} 
  color="#8B4513" 
  rotationDuration={3000} 
  reverse={false} 
/>
```

## 📱 Platform Desteği

### **iOS**

- ✅ Native performans
- ✅ Smooth animasyonlar
- ✅ Platform-specific optimizasyonlar

### **Android**

- ✅ Material Design uyumlu
- ✅ Hardware acceleration
- ✅ Adaptive icons desteği

### **Web**

- ✅ Responsive tasarım
- ✅ Cross-browser uyumluluk
- ✅ Progressive Web App desteği

## 🧪 Test

### **Unit Tests**

```bash
npm test -- NewspaperSplashScreen.test.js
```

### **Test Coverage**

- Component rendering
- Animasyon timing
- Callback fonksiyonları
- Styling ve layout

## 🎨 Tasarım Sistemi

### **Typography Scale**

```javascript
const TYPOGRAPHY = {
  mainTitle: 32,      // Playfair Display Bold
  subtitle: 14,       // Lato Italic
  cornerDate: 10,     // Playfair Display Regular
  headline: 8,        // Lato Bold
  footerText: 10      // Lato Regular
};
```

### **Spacing System**

```javascript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 60
};
```

### **Shadow System**

```javascript
const SHADOWS = {
  logo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  }
};
```

## 🔄 Gelecek Geliştirmeler

### **Planlanan Özellikler**

- [ ] Dark mode desteği
- [ ] Lokalizasyon (çoklu dil)
- [ ] Dinamik tarih gösterimi
- [ ] Ses efektleri
- [ ] Haptic feedback

### **Performans İyileştirmeleri**

- [ ] Lazy loading
- [ ] Image optimization
- [ ] Memory management
- [ ] Bundle size optimization

## 🐛 Bilinen Sorunlar

### **Platform Farklılıkları**

- Android'de shadow rendering farklılıkları
- iOS'ta font loading timing
- Web'de CSS transform desteği

### **Çözümler**

- Platform-specific styling
- Font loading state management
- Fallback animasyonlar

## 📚 Kaynaklar

### **Kullanılan Kütüphaneler**

- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Expo Google Fonts](https://docs.expo.dev/guides/using-custom-fonts/)

### **Tasarım İlhamları**

- Vintage gazete tasarımları
- Retro tipografi
- Historical aesthetics
- Minimalist layout principles

## 🤝 Katkıda Bulunma

### **Geliştirme Süreci**

1. Feature branch oluştur
2. Kod yaz ve test et
3. Pull request aç
4. Code review sürecini bekle

### **Kod Standartları**

- ESLint kurallarına uy
- Prettier ile formatla
- TypeScript tip tanımları ekle
- JSDoc ile dokümante et

---

**Not**: Bu splash screen, uygulamanın tarihi gazete temasına uygun olarak tasarlanmıştır ve kullanıcı deneyimini iyileştirmek için optimize edilmiştir.
