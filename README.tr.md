# RSVP Reader

**Canlı demo:** [https://makalin.github.io/RSVP-Reader/](https://makalin.github.io/RSVP-Reader/)

[🇬🇧 English](README.md)

Minimal **Hızlı Seri Görsel Sunum (RSVP)** web okuyucu.  
Belgeleri **tek kelime** halinde, ekranın ortasında, ayarlanabilir **DKM** (dakikada kelime) ile okuyun — dikkat dağıtıcısız ve hızlı.

## RSVP Nedir?
RSVP (Hızlı Seri Görsel Sunum), kelimeleri sabit bir odak noktasında sırayla gösterir; göz hareketini azaltır ve yüksek okuma hızlarına olanak tanır.

## Özellikler

- **Gerçek RSVP modu** (aynı anda 1 kelime)
- **DKM kontrolü** (100–1200+)
- **Oynat / Duraklat / Devam**
- **Geri / İleri sarma**
- **ORP (Optimal Tanıma Noktası)** vurgusu
- **Noktalama farkında duraklamalar**
- **Kısa kelime telafisi**
- **Blok modu** (2–4 kelime, isteğe bağlı)
- **Tam ekran ve sade arayüz**
- **Klavye odaklı kontroller**
- **Yalnızca yerel** (izleme yok, yükleme yok)

## Klavye Kısayolları

| Tuş | İşlem |
|-----|--------|
| Boşluk | Oynat / Duraklat |
| ← / → | Geri / İleri sarma |
| Shift + ← / → | Büyük sarma |
| ↑ / ↓ | DKM artır / azalt |
| F | Tam ekran |
| H | Arayüzü aç/kapat |
| R | Baştan oynat |

## Nasıl Çalışır

```
delay(ms) = 60000 / WPM
delay += punctuationPause
delay *= shortWordFactor
```

Metin bir kez tokenize edilir, ardından tek bir ortalanmış kelimeyle en iyi performans için render edilir.

## Desteklenen Girdiler

- Düz metin yapıştırma
- `.txt`, `.md`, `.html`
- (İsteğe bağlı) `.pdf`, `.epub` eklentilerle

## Teknoloji Yığını

- Vite
- React + TypeScript
- CSS (UI framework yok)
- İsteğe bağlı: `pdfjs-dist`, `epubjs`

## Proje Yapısı

```
src/
reader/
Reader.tsx
rsvpEngine.ts
tokenizer.ts
ui/
Slider.tsx
styles/
reader.css
```

## Başlarken

```bash
npm install
npm run dev
```

Derleme:

```bash
npm run build
```

## GitHub Pages’e Dağıtım

**Seçenek A – Otomatik (önerilen)**

1. Repoyu GitHub’a push edin.
2. Repoda: **Settings → Pages**.
3. **Build and deployment** altında **Source**’u **GitHub Actions** yapın.
4. `main` branch’e push edin; workflow derleyip yayınlayacaktır.

Site adresi: `https://<kullanıcı-adı>.github.io/RSVP-Reader/`

**Seçenek B – Kendi bilgisayarınızdan dağıtım**

```bash
npm run deploy
```

Reponun GitHub’da olması gerekir. İlk kez GitHub Pages kullanıyorsanız **Settings → Pages** (Source: **Deploy from a branch**, branch: `gh-pages`) ile etkinleştirin.

**Repo adınız `RSVP-Reader` değilse:**  
`vite.config.ts` içinde `base` yolunu `'/repo-adınız/'` olarak değiştirin.

## Tasarım Felsefesi

* Tek odak noktası
* Kaydırma yok
* Görsel gürültü yok
* Her şey ayarlanabilir, hiçbir şey zorunlu değil

## Yol Haritası

* Kalibrasyon modu
* Okuma istatistikleri (tahmini süre, tamamlanma)
* Dile duyarlı tokenizasyon
* Mobil öncelikli kontroller
* PWA çevrimdışı mod

## Gizlilik

* Tamamen tarayıcıda çalışır
* Analitik yok
* Varsayılan olarak ağ isteği yok

## Lisans

MIT
