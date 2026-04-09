# Kur'an Türkçe Satır Arası Transliterasyon

Kur'an-ı Kerim'in **kelime kelime, heceli Türkçe transliterasyonu**.

İki açık kaynak veriyi birleştirerek üretilmiştir:

| Kaynak | Ne sağlıyor | Lisans |
|--------|-------------|--------|
| [QuranWBW](https://quranwbw.com) | Kelime-kelime hece yapısı (Arapça kelime sınırları) | MIT |
| [Açık Kuran](https://acikkuran.com) | Türkçe fonetik okunuş | CC BY-NC-SA 4.0 |

## Sorun

QuranWBW İngilizce fonetik kullanır ve bazı sesler Türkçe'ye uygun değildir:

```
Yaw-mid-Deen    →  yanlış: "yav" yerine "yev" olmalı
Raḥ-maa-nir     →  gereksiz özel karakterler: ḥ, ā
```

Açık Kuran doğru Türkçe okunuş verir ama kelime-kelime hece yapısı yoktur:

```
"maliki yevmid din"   →  düz metin, hece ayrımı yok
```

## Çözüm

Bu proje, **Needleman-Wunsch dizi hizalama algoritması** ile iki veriyi eşleştirir:

1. Her iki metni ortak fonetik forma normalize eder
2. Karakter bazlı hizalama ile QuranWBW kelime sınırlarını Türkçe metne uygular
3. Hece yapısını koruyarak Türkçe transliterasyon üretir

```
QuranWBW:   ["Maa-li-ki",  "Yaw-mid-",  "Deen"]
Açık Kuran: "maliki yevmid din"
Sonuç:      ["Ma-li-ki",   "Yev-mid-",  "Din"]
```

## Kullanım

### Hazır veri

`output/turkish-syllables.json` dosyası 6236 ayetin tamamını içerir:

```json
{
  "1:1": ["Bis-mil-", "la-hir-", "Rah-ma-nir-", "Ra-him"],
  "1:2": ["El-ham-du", "Lil-la-hi", "Rab-bil-", "A-le-min"],
  ...
}
```

### Programatik kullanım

```js
const { convertVerse } = require("kuran-turkce-satir-arasi");

const result = convertVerse(
  ["Maa-li-ki", "Yaw-mid-", "Deen"],  // QuranWBW heceleri
  "maliki yevmid din"                   // Türkçe fonetik
);
// → ["Ma-li-ki", "Yev-mid-", "Din"]
```

### Veriyi yeniden üretme

```bash
node generate.js
```

## Veri Formatı

```
"sure:ayet": ["kelime1", "kelime2", ...]
```

- Her kelime bir Arapça kelimeye karşılık gelir
- Heceler `-` ile ayrılır
- Sondaki `-` bir sonraki kelimeyle bağlantıyı gösterir (vasl)
- İlk harf büyük yazılır

## Algoritma

Detaylı açıklama için `src/` dizinine bakın:

- **`normalize.js`** — QuranWBW ve Türkçe metni ortak forma dönüştürür
- **`align.js`** — Needleman-Wunsch karakter hizalama
- **`convert.js`** — Hizalamayı kullanarak kelime/hece sınırlarını Türkçe metne uygular

## Kaynaklar ve Teşekkür

Bu proje aşağıdaki açık kaynak projelerin verileri üzerine inşa edilmiştir:

### QuranWBW
- **Website:** https://quranwbw.com
- **Lisans:** MIT
- **Kullanılan veri:** Kelime-kelime hece yapısı (word-by-word syllable transliteration)

### Açık Kuran
- **Website:** https://acikkuran.com
- **GitHub:** https://github.com/nickaknew/acikkuran
- **Lisans:** Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)
- **Kullanılan veri:** Türkçe fonetik ayet transliterasyonu

> **Not:** Açık Kuran verisi CC BY-NC-SA 4.0 lisansı altındadır. Bu lisans ticari kullanımı kısıtlar. Ticari projeler için Açık Kuran'ın lisans şartlarını kontrol edin.

## Lisans

Bu projenin **kaynak kodu** MIT lisansı altındadır.

**Veri dosyaları** kaynaklarının orijinal lisanslarına tabidir (yukarıya bakın).
