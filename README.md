# Kur'an Türkçe Satır Arası

Kur'an-ı Kerim için **kelime kelime Türkçe okunuş** (transliterasyon) ve **meal** gösteren açık kaynak proje.

Arapça metinde herhangi bir kelimeye tıklayın, o kelimenin Türkçe okunuşunu hecelenmiş olarak görün.

## Ne Yapıyor?

```
1. QuranWBW'den kelime-kelime İngilizce heceleri alır
     ["Maa-li-ki", "Yaw-mid-", "Deen"]

2. Açık Kuran'ın Türkçe fonetik verisini kullanarak eşler
     "maliki yevmid din"

3. Needleman-Wunsch hizalama ile birleştirir
     ["ma-li-ki", "yev-mid-", "din"]

4. Arapça metinde kelimeye tıklayınca bubble ile okunuş gösterir
5. Ayetin altında Diyanet İşleri meali yer alır
```

## Demo

`demo/index.html` dosyasını bir HTTP sunucusu ile açın:

```bash
npx serve .
# → http://localhost:3000/demo/
```

Demo özellikleri:
- 114 sure, 6236 ayet
- Arapça kelimeye tıkla, hecelenmiş Türkçe okunuşu gör
- Diyanet İşleri meali
- 3 tema: Papirus, Deniz, Gece

## Sorun

**QuranWBW** İngilizce fonetik kullanır. Türkçe okunuş için uygun değildir:

```
yaw-mid-deen  →  Türkçe'de "yev-mid-din" olmalı
Raḥ-maa-nir   →  özel karakterler gereksiz, "rah-ma-nir" yeterli
```

**Açık Kuran** doğru Türkçe okunuş verir ama kelime kelime hece yapısı yoktur:

```
"maliki yevmid din"  →  düz metin, hangi hece hangi kelimeye ait belli değil
```

## Çözüm

**Needleman-Wunsch dizi hizalama algoritması** ile iki veriyi eşleştiriyoruz:

1. QuranWBW ve Açık Kuran metinlerini ortak fonetik forma normalize et
2. Karakter bazlı hizalama ile QuranWBW'nin kelime sınırlarını Türkçe metne uygula
3. Hece yapısını koruyarak Türkçe transliterasyon üret

## Hazır Veri

`output/turkish-syllables.json` — 6236 ayetin tamamı:

```json
{
  "1:1": ["bis-mil-", "la-hir-", "rah-ma-nir-", "ra-him"],
  "1:2": ["el-ham-du", "lil-la-hi", "rab-bil-", "a-le-min"],
  "1:4": ["ma-li-ki", "yev-mid-", "din"]
}
```

### Format

- `"sure:ayet"` → kelime dizisi
- Her kelime bir Arapça kelimeye karşılık gelir
- Heceler `-` ile ayrılır
- Sondaki `-` bir sonraki kelimeyle bağlantıyı gösterir (vasl)
- Tamamı küçük harf

## Programatik Kullanım

```js
const { convertVerse } = require("kuran-turkce-satir-arasi");

const result = convertVerse(
  ["Maa-li-ki", "Yaw-mid-", "Deen"],  // QuranWBW heceleri
  "maliki yevmid din"                   // Türkçe fonetik
);
// → ["ma-li-ki", "yev-mid-", "din"]
```

### Veriyi yeniden üretme

```bash
node generate.js
```

## Algoritma

| Dosya | Ne yapar |
|-------|----------|
| `src/normalize.js` | QuranWBW ve Türkçe metni ortak fonetik forma dönüştürür |
| `src/align.js` | Needleman-Wunsch karakter hizalama |
| `src/convert.js` | Hizalamayı kullanarak kelime/hece sınırlarını Türkçe metne uygular |

## Kaynaklar ve Teşekkür

| Kaynak | Kullanım | Lisans |
|--------|----------|--------|
| [QuranWBW](https://quranwbw.com) | Kelime-kelime İngilizce hece yapısı | MIT |
| [Açık Kuran](https://acikkuran.com) | Türkçe fonetik ayet transliterasyonu | CC BY-NC-SA 4.0 |
| [Mahfuz](https://github.com/Quirah/mahfuz) | Demo UI tasarımı ve Arapça metin verisi | - |
| [Diyanet İşleri](https://www.diyanet.gov.tr) | Türkçe meal | - |

### QuranWBW
- **Website:** https://quranwbw.com
- **Kullanılan veri:** Kelime-kelime hece yapısı (word-by-word syllable transliteration)

### Açık Kuran
- **Website:** https://acikkuran.com
- **GitHub:** https://github.com/nickaknew/acikkuran
- **Kullanılan veri:** Türkçe fonetik ayet transliterasyonu

### Mahfuz
- **GitHub:** https://github.com/Quirah/mahfuz
- **Kullanılan:** Demo arayüzü Mahfuz'un okuyucu bileşenlerinden (tema sistemi, kelime bubble mekanigi, ayet yerlesimi) ilham alinarak tasarlanmistir. Arapca Osmani metni Mahfuz veritabanindan alinmistir.

> **Lisans notu:** Açık Kuran verisi CC BY-NC-SA 4.0 lisansı altındadır ve ticari kullanımı kısıtlar. Ticari projeler için lisans şartlarını kontrol edin.

## Lisans

Kaynak kodu **MIT** lisansı altındadır. Veri dosyaları kaynaklarının orijinal lisanslarına tabidir.
