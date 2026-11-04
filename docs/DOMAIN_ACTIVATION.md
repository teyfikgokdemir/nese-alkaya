# nesealkaya.com — Alan Adı Aktivasyon Kontrol Listesi

Durum (2026-11-04): Kod tarafında nesealkaya.com kanonik hedef olarak hazırlanmıştır. Ancak Cloudflare Pages projesinde şu an yalnızca nese-alkaya.pages.dev domaini bulunmaktadır. **Bu belge DNS'in bağlandığı veya özel alan adında HTTPS'in çalıştığı anlamına gelmez.**

## 1. Bağlantı
1. Cloudflare hesabında Pages > nese-alkaya > Custom domains bölümünü açın.
2. `nesealkaya.com` alan adını ekleyin. DNS ayarlarını panelin gösterdiği hedeflere göre yapılandırın. Domain başka bir DNS sağlayıcısındaysa nameserver / CNAME / apex yöntemini sağlayıcının ve Cloudflare'in güncel yönergelerine göre seçin.
3. `www.nesealkaya.com` için yönlendirme stratejisini kararlaştırın: tercihen www → çıplak alan adı 301. İki ana domaini eşzamanlı kanonik yapmayın.
4. Cloudflare özel alan adında TLS sertifikası etkinleşene ve Pages domain durumu active olana kadar tamamlandı demeyin.

## 2. Canlı kontrol
- `https://nesealkaya.com/` ve `https://nesealkaya.com/de/` HTTP 200, doğru dil ve doğru görsel.
- `/hakkimda/`, `/de/ueber-mich/` ve 26 hizmet detayı ve 16 blog yazısı HTTP 200.
- Tüm 54 indekslenebilir sayfada canonical ve karşılıklı hreflang `nesealkaya.com` üzerinde.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/llms-tr.txt`, `/llms-de.txt` ve `/ai-catalog.json`, `/.well-known/ard.json`, `/.well-known/ai-catalog.json` 200.
- Sosyal paylaşım önizlemesi ve telefon/e-posta/WhatsApp bağlantıları tekrar test.
- Olası 301 yönlendirmelerden sonra döngü, 404 veya karışık içerik hatası olmamalı.

## 3. Indexleme ve ölçüm
- Google Search Console'da domain mülkiyet doğrulaması; sitemap gönderimi ve coverage kontrolü (gerçek işlem yapılmadan tamamlandı yazılmamalı).
- Bing Webmaster Tools / IndexNow kurulum ve izinli anahtar gerekiyorsa doğrulama.
- GA4 / Cloudflare Web Analytics için gerçek mülkiyet, ölçüm kimliği ve uygun gizlilik metni sağlanana kadar sahte takip kodu eklemeyin.
- Bilgi erişim dosyaları (llms/ai-catalog) keşif amaçlıdır; arama motorlarında veya YZ yanıtlarında görünürlük garantisi değildir.

## Kapsam/kanıt
Önizleme branch'i: design/bilingual-heritage-seo. Domain bağlantısından önceki üretim kontrolleri, özel alan adındaki canlı uç nokta testinin yerine geçmez.

## Kod ve içerik kalite kapısı (alan adı öncesi)
- `npm run build` + `npm run verify` başarılı olmalı; GitHub Actions quality gate ayrıca izlenmeli.
- 54 sayfa, 16 makale, iki dil, iç bağlantılar, canonical, hreflang, JSON-LD ve güvenlik başlıkları derleme sonrası test edilmelidir.
- Almanya'da ticari hizmet sitesi için Impressum/Datenschutzerklärung gereklilikleri işletme sorumlusu ve hukuki bilgiler doğrulandıktan sonra karşılanmalı.
