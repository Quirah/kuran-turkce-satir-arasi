# Kur'an Turkce Satir Arasi

Kur'an-i Kerim icin **kelime kelime Turkce okunus** gosteren Android uygulama ve acik kaynak algoritma.

Arapca metinde herhangi bir kelimeye tiklayin, o kelimenin Turkce okunusunu hecelenmis olarak gorun.

## Kurulum (Obtainium)

[Obtainium](https://obtainium.imranr.dev/) ile kurarsaniz yeni surum ciktiginda otomatik bildirim alirsiniz.

1. Obtainium'u telefonunuza kurun
2. **Add App** butonuna basin
3. URL olarak su adresi girin:
   ```
   https://github.com/Quirah/kuran-turkce-satir-arasi
   ```
4. **Add** butonuna basin, uygulama otomatik indirilir ve kurulur

### Manuel Kurulum

[Releases](https://github.com/Quirah/kuran-turkce-satir-arasi/releases) sayfasindan son surumun APK dosyasini indirip telefonunuza kurun.

## Ozellikler

- **114 sure, 6236 ayet** — Kur'an-i Kerim'in tamami
- **Sure secim ekrani** — Arama destegi, son okunan sure badge'i
- **Kelime kelime okunus** — Arapca kelimeye tikla, hecelenmis Turkce okunusu gor
- **Iki bubble modu:**
  - *Turkce okunusa gore:* Turkce okuyusta birlesen kelimeler tek bubble (ornek: bismillahir)
  - *Arapca kelimeye gore:* Her Arapca kelime ayri bubble, sondaki `-` devam isareti (ornek: bis-mil-)
- **Diyanet Isleri meali** — Her ayetin altinda Turkce meal
- **3 tema:** Papirus, Deniz, Gece
- **Arapca yazi boyutu ayari** — 8 kademe buyutme/kucultme
- **Son kalinan yer hafizasi** — Sure, scroll pozisyonu, tema, yazi boyutu ve bubble modu tercihi saklanir
- **Tamamen offline** — Tum veri uygulama icinde, internet gerektirmez

## Nasil Calisiyor?

```
1. QuranWBW'den kelime-kelime Ingilizce heceleri alinir
     ["Maa-li-ki", "Yaw-mid-", "Deen"]

2. Acik Kuran'in Turkce fonetik verisiyle eslestirilir
     "maliki yevmid din"

3. Needleman-Wunsch hizalama algoritmasi ile birlestirilir
     ["ma-li-ki", "yev-mid-", "din"]

4. Arapca metinde kelimeye tiklaninca bubble ile okunus gosterilir
5. Ayetin altinda Diyanet Isleri meali yer alir
```

## Hazir Veri

`output/turkish-syllables.json` — 6236 ayetin tamami:

```json
{
  "1:1": ["bis-mil-", "la-hir-", "rah-ma-nir-", "ra-him"],
  "1:2": ["el-ham-du", "lil-la-hi", "rab-bil-", "a-le-min"],
  "1:4": ["ma-li-ki", "yev-mid-", "din"]
}
```

### Format

- `"sure:ayet"` -> kelime dizisi
- Her kelime bir Arapca kelimeye karsilik gelir
- Heceler `-` ile ayrilir
- Sondaki `-` bir sonraki kelimeyle baglantiyi gosterir (vasl)
- Tamami kucuk harf

## Programatik Kullanim

```js
const { convertVerse } = require("kuran-turkce-satir-arasi");

const result = convertVerse(
  ["Maa-li-ki", "Yaw-mid-", "Deen"],  // QuranWBW heceleri
  "maliki yevmid din"                   // Turkce fonetik
);
// -> ["ma-li-ki", "yev-mid-", "din"]
```

### Veriyi yeniden uretme

```bash
node generate.js
```

## Algoritma

| Dosya | Ne yapar |
|-------|----------|
| `src/normalize.js` | QuranWBW ve Turkce metni ortak fonetik forma donusturur |
| `src/align.js` | Needleman-Wunsch karakter hizalama |
| `src/convert.js` | Hizalamayi kullanarak kelime/hece sinirlarini Turkce metne uygular |

## Kaynaklar ve Tesekkur

| Kaynak | Kullanim | Lisans |
|--------|----------|--------|
| [QuranWBW](https://quranwbw.com) | Kelime-kelime Ingilizce hece yapisi | MIT |
| [Acik Kuran](https://acikkuran.com) | Turkce fonetik ayet transliterasyonu | CC BY-NC-SA 4.0 |
| [Mahfuz](https://github.com/Quirah/mahfuz) | Demo UI tasarimi ve Arapca metin verisi | - |
| [Diyanet Isleri](https://www.diyanet.gov.tr) | Turkce meal | - |

> **Lisans notu:** Acik Kuran verisi CC BY-NC-SA 4.0 lisansi altindadir ve ticari kullanimi kisitlar. Ticari projeler icin lisans sartlarini kontrol edin.

## Lisans

Kaynak kodu **MIT** lisansi altindadir. Veri dosyalari kaynaklarinin orijinal lisanslarina tabidir.
