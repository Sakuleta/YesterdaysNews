# Performance Testing Guide

## 📱 Manual Performance Testing

Bu rehber, Yesterdays News uygulamasının performansını manuel olarak test etmek için hazırlanmıştır.

### 🎯 Test Hedefleri

- **Cold Start:** < 3 saniye
- **Warm Start:** < 1 saniye  
- **Memory Usage:** < 100MB
- **Smooth Scrolling:** 60 FPS
- **Responsive UI:** < 100ms touch response

---

## 🧪 Test Senaryoları

### 1. Cold Start Test (Soğuk Başlatma)

**Amaç:** Uygulamanın ilk açılış performansını ölçmek

**Adımlar:**

1. Telefonu yeniden başlatın (tüm cache'leri temizlemek için)
2. Kronometre başlatın
3. Yesterdays News uygulamasını açın
4. Ana ekran tamamen yüklenene kadar bekleyin
5. Kronometreyi durdurun

**Beklenen Sonuç:** < 3 saniye

**Not:** İlk açılışta hava durumu ve haberler yüklenene kadar bekleyin.

---

### 2. Warm Start Test (Sıcak Başlatma)

**Amaç:** Uygulamanın background'dan dönüş performansını ölçmek

**Adımlar:**

1. Uygulamayı açın ve tamamen yüklenmesini bekleyin
2. Home tuşuna basın (uygulamayı background'a alın)
3. Kronometre başlatın
4. Uygulamayı tekrar açın
5. Ana ekran görünür olur olmaz kronometreyi durdurun

**Beklenen Sonuç:** < 1 saniye

---

### 3. Memory Usage Test (Bellek Kullanımı)

**Amaç:** Uygulamanın bellek kullanımını ölçmek

**Adımlar:**

1. Ayarlar → Uygulamalar → Yesterdays News → Depolama
2. Bellek kullanımını not edin
3. Uygulamayı 10 dakika kullanın
4. Tekrar bellek kullanımını kontrol edin

**Beklenen Sonuç:** < 100MB

---

### 4. Scrolling Performance Test (Kaydırma Performansı)

**Amaç:** Liste kaydırma performansını test etmek

**Adımlar:**

1. Uygulamayı açın
2. Haber listesini hızlıca yukarı-aşağı kaydırın
3. Takılma, donma veya yavaşlama olup olmadığını gözlemleyin
4. 50+ haber kartı arasında kaydırma yapın

**Beklenen Sonuç:** Smooth 60 FPS kaydırma

---

### 5. Language Switch Performance Test (Dil Değiştirme)

**Amaç:** Dil değiştirme performansını test etmek

**Adımlar:**

1. Uygulamayı açın
2. Dil değiştirici butonuna basın
3. Farklı bir dil seçin
4. Yeni dildeki içeriğin yüklenme süresini ölçün

**Beklenen Sonuç:** < 2 saniye

---

### 6. Offline Performance Test (Çevrimdışı Performans)

**Amaç:** Offline durumda uygulama performansını test etmek

**Adımlar:**

1. Uygulamayı açın ve tamamen yüklenmesini bekleyin
2. İnternet bağlantısını kapatın
3. Uygulamayı kapatıp tekrar açın
4. Cache'den yüklenme süresini ölçün

**Beklenen Sonuç:** < 1 saniye (cache'den)

---

### 7. Pull-to-Refresh Performance Test

**Amaç:** Yenileme performansını test etmek

**Adımlar:**

1. Uygulamayı açın
2. Liste başına çekip yenileme yapın
3. Yeni içeriğin yüklenme süresini ölçün

**Beklenen Sonuç:** < 3 saniye

---

## 📊 Test Sonuçları

### Test Formu

| Test | Süre | Sonuç | Notlar |
|------|------|-------|--------|
| Cold Start | ___ saniye | ✅/❌ | |
| Warm Start | ___ saniye | ✅/❌ | |
| Memory Usage | ___ MB | ✅/❌ | |
| Scrolling | Smooth/Choppy | ✅/❌ | |
| Language Switch | ___ saniye | ✅/❌ | |
| Offline Load | ___ saniye | ✅/❌ | |
| Pull-to-Refresh | ___ saniye | ✅/❌ | |

### Değerlendirme Kriterleri

- ✅ **Mükemmel:** Hedefin altında
- ⚠️ **Kabul Edilebilir:** Hedefin %20 üstüne kadar
- ❌ **Kötü:** Hedefin %20 üstü

---

## 🔧 Performance Monitoring

### Console Logs

Uygulama çalışırken console'da şu logları görebilirsiniz:

```text
🚀 App launch started at: 2024-08-26T20:30:00.000Z
✅ App fully loaded in 2500ms
🎨 EventCard rendered in 15ms
📊 Performance Summary: {...}
```

### Performance Metrics

Uygulama içinde performance verileri AsyncStorage'da saklanır:

- `perf_coldStart`: Soğuk başlatma süreleri
- `perf_renderTimes`: Component render süreleri

---

## 🚀 Performance Optimization Tips

### Startup Optimization

- Lazy loading kullanın
- Gereksiz import'ları kaldırın
- Bundle size'ı optimize edin

### Memory Optimization

- Image caching kullanın
- Component lifecycle'ı doğru yönetin
- Memory leak'leri önleyin

### UI Optimization

- FlatList kullanın
- getItemLayout implement edin
- shouldItemUpdate optimize edin

---

## 📱 Test Cihazları

### Önerilen Test Cihazları

- **Low-end:** 2GB RAM, Android 7.0+
- **Mid-range:** 4GB RAM, Android 9.0+
- **High-end:** 6GB+ RAM, Android 11.0+

### Test Ortamları

- **Development:** Debug build
- **Staging:** Release build (debuggable)
- **Production:** Release build (optimized)

---

## 📈 Performance Benchmarks

### Industry Standards

- **Cold Start:** < 2s (excellent), < 3s (good), < 5s (acceptable)
- **Warm Start:** < 500ms (excellent), < 1s (good), < 2s (acceptable)
- **Memory:** < 50MB (excellent), < 100MB (good), < 200MB (acceptable)

### Our Targets

- **Cold Start:** < 3s
- **Warm Start:** < 1s
- **Memory:** < 100MB
- **Bundle Size:** < 30MB

---

## 🐛 Performance Issues

### Common Issues

1. **Slow Cold Start**
   - Çok fazla initial import
   - Heavy component'ler
   - Network request'ler

2. **High Memory Usage**
   - Image cache'lenmemiş
   - Memory leak'ler
   - Large data structures

3. **Choppy Scrolling**
   - FlatList optimize edilmemiş
   - Heavy render operations
   - Too many re-renders

### Solutions

- Code splitting
- Lazy loading
- Image optimization
- Memory profiling
- Performance monitoring

---

*Bu rehber, Yesterdays News uygulamasının performans testleri için hazırlanmıştır.*
