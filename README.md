# Kur'an Turkce Satir Arasi

Kur'an-i Kerim'in Arapca metninde herhangi bir kelimeye tiklayin, o kelimenin **Turkce okunusunu hecelenmis olarak** gorun.

Turkce bilen ama Arapca okuyamayan kisilerin Kur'an'i dogru telaffuzla okuyabilmesini amaclar. Duz Latin harfli transliterasyon yerine, her Arapca kelimenin hecelere ayrilmis Turkce karsiligini gosterir.

<p align="center">
  <img src="ss.jpg" alt="Uygulama ekran goruntusu" width="300">
</p>

## Kurulum

### Obtainium (Onerilen)

[Obtainium](https://obtainium.imranr.dev/) ile kurarsaniz yeni surum ciktiginda otomatik bildirim alirsiniz.

1. Obtainium'u telefonunuza kurun
2. **Add App** butonuna basin
3. URL olarak su adresi girin:
   ```
   https://github.com/Quirah/kuran-turkce-satir-arasi
   ```
4. **Add** butonuna basin — uygulama otomatik indirilir ve kurulur

### Manuel Kurulum

[Releases](https://github.com/Quirah/kuran-turkce-satir-arasi/releases) sayfasindan son surumun APK dosyasini indirip telefonunuza kurun.

## Uygulama Ozellikleri

- **114 sure, 6236 ayet** — Kur'an-i Kerim'in tamami
- **Kelimeye tikla, okunusu gor** — Arapca kelimeye dokunun, hecelenmis Turkce okunus bubble olarak gorunur
- **Diyanet Isleri meali** — Her ayetin altinda Turkce meal
- **Sure secim ekrani** — Arama destegi, son okunan sure isaretli
- **3 tema:** Papirus, Deniz, Gece
- **Yazi boyutu ayari** — Arapca metin 8 kademeli buyutme/kucultme
- **Kaldigi yerden devam** — Son okunan sure, scroll pozisyonu ve tum tercihler hafizada kalir
- **Tamamen offline** — Internet gerektirmez

## Problem ve Cozum

Turkce Kur'an okunusu icin iki onemli acik kaynak veri seti var. Ikisinin de eksigi var:

**[QuranWBW](https://quranwbw.com)** kelime kelime hece yapisi sunar ama Ingilizce fonetik kullanir:

```
Yaw-mid-Deen   →  Turkce'de "yev-mid-din" olmali
Raḥ-maa-nir    →  ozel karakterler gereksiz, "rah-ma-nir" yeterli
```

**[Acik Kuran](https://acikkuran.com)** dogru Turkce okunus verir ama duz metin olarak — hangi hece hangi Arapca kelimeye ait belli degil:

```
"maliki yevmid din"  →  kelime siniri yok, hece yapisi yok
```

### Cozum: Needleman-Wunsch Hizalama

Bu proje iki veri setini **Needleman-Wunsch dizi hizalama algoritmasi** ile birlestirerek her iki eksigi giderir:

```
Adim 1 — Normalizasyon
  QuranWBW:   "Maa-li-ki"  →  "maliki"     (kucuk harf, uzun unlu kisalt, ozel karakter sil)
  Acik Kuran: "maliki"     →  "maliki"     (ı→i, aksanlar sil)

Adim 2 — Karakter hizalama
  Normalize edilmis iki diziyi karakter karakter hizala.
  QuranWBW'nin kelime ve hece sinirlari artik Turkce metnin
  hangi bolumuyle eslesiyor belli.

Adim 3 — Hece yapisi aktarimi
  QuranWBW:    ["Maa-li-ki", "Yaw-mid-",  "Deen"]
  Acik Kuran:  "maliki yevmid din"
  Sonuc:       ["ma-li-ki",  "yev-mid-",  "din"]
```

Her Arapca kelime icin hecelenmis Turkce okunus elde edilir. 6236 ayetin tamami bu sekilde islenir.

### Algoritma Detayi

| Dosya | Islem |
|-------|-------|
| `src/normalize.js` | Iki veri setini ortak fonetik forma donusturur. QuranWBW icin: hece bazli digraph koruma (sh, kh), NFD Unicode decomposition ile aksan silme, uzun unlu kisaltma (aa→a), q→k, w→v. Acik Kuran icin: ı→i, NFD aksan silme (s→s, c→c). |
| `src/align.js` | Needleman-Wunsch uygulamasi. Benzer cift skorlamasi (a-e, i-u gibi) ile daha iyi hizalama saglar. Cikti: her QuranWBW pozisyonunun Acik Kuran'daki karsiligini gosteren esleme dizisi. |
| `src/convert.js` | Hizalama sonucunu kullanarak QuranWBW'nin kelime/hece sinirlarini Turkce metin uzerine uygular. Sonuc: her Arapca kelime icin hecelenmis Turkce okunus. |

### Hazir Veri

`output/turkish-syllables.json` — 6236 ayetin tamami, kullanima hazir:

```json
{
  "1:1": ["bis-mil-", "la-hir-", "rah-ma-nir-", "ra-him"],
  "1:2": ["el-ham-du", "lil-la-hi", "rab-bil-", "a-le-min"],
  "1:4": ["ma-li-ki", "yev-mid-", "din"]
}
```

- `"sure:ayet"` → kelime dizisi (her kelime bir Arapca kelimeye karsilik gelir)
- Heceler `-` ile ayrilir
- Sondaki `-` bir sonraki kelimeyle baglantiyi gosterir (vasl)
- Tamami kucuk harf

### Programatik Kullanim

```js
const { convertVerse } = require("kuran-turkce-satir-arasi");

const result = convertVerse(
  ["Maa-li-ki", "Yaw-mid-", "Deen"],  // QuranWBW heceleri
  "maliki yevmid din"                   // Turkce fonetik
);
// → ["ma-li-ki", "yev-mid-", "din"]
```

Veriyi sifirdan yeniden uretmek icin: `node generate.js`

## Kaynaklar ve Tesekkur

| Kaynak | Kullanim | Lisans |
|--------|----------|--------|
| [QuranWBW](https://quranwbw.com) | Kelime-kelime Ingilizce hece yapisi kaynak verisi | MIT |
| [Acik Kuran](https://acikkuran.com) | Turkce fonetik ayet transliterasyonu kaynak verisi | CC BY-NC-SA 4.0 |
| [Mahfuz](https://github.com/Quirah/mahfuz) | Arapca Osmani metni ve uygulama arayuzu tasarim referansi | - |
| [Diyanet Isleri Baskanligi](https://www.diyanet.gov.tr) | Turkce meal | - |

> **Lisans notu:** Acik Kuran verisi CC BY-NC-SA 4.0 lisansi altindadir ve ticari kullanimi kisitlar. Ticari projeler icin lisans sartlarini kontrol edin.

## Lisans

Kaynak kodu **MIT** lisansi altindadir. Veri dosyalari kaynaklarinin orijinal lisanslarina tabidir.
