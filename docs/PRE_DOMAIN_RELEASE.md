# Neşe Alkaya — Alan adı öncesi hazırlık raporu

Tarih: 2026-11-04. Bu doküman mevcut projede `nesealkaya.com` DNS bağlantısı yapılmadan tamamlanabilecek işleri ve alan adını gerektiren testleri ayırır.

## Mevcut teknik altyapı
- GitHub `teyfikgokdemir/nese-alkaya`, Astro 5 statik, Cloudflare Pages, Türkçe/Almanca.
- 54 indekslenebilir rota: her dilde ana sayfa/kurumsal/hizmet içerikleri ve 8 özgün blog yazısı.
- Canonical, reciprocal hreflang, x-default, XML sitemap, robots.txt, JSON-LD Person/WebSite/WebPage/Service/Blog/BlogPosting/BreadcrumbList, uygun yerlerde FAQPage.
- llms.txt, llms-full.txt, llms-tr.txt, llms-de.txt, site ai-catalog.json, ARD 1.0 / .well-known manifestleri.
- Erişilebilirlik: mobil menü düğmesi, klavye odakları, azaltılmış hareket, kayan WhatsApp ve yukarı butonlarının ayrı etiketleri.

## Otomatik kalite kapısı
- `npm run build` Astro derlemesinden sonra `scripts/verify-build.mjs` çalıştırır. Eksik rotalar, kırık iç bağlantılar, hatalı canonical/hreflang ve JSON-LD derlemeyi başarısız kılar.
- GitHub Actions `.github/workflows/quality.yml` pull request ve `main` işlemlerinde aynı testi çalıştırır.
- Cloudflare önizleme build başarısı, bu testin çalıştığını doğrular; ayrıca GitHub Actions durumu ve son canlı deployment ayrı raporlanmalı.

## Domain bağımlılığı olmadan yapılamayan / karar gerektiren işler
1. `nesealkaya.com` ve `www.nesealkaya.com` alan adı bağlantısı, TLS ve 301 yönlendirmesi. Kanonik, sitemap, sosyal OG URL'leri gelecekteki domaine işaret ediyor.
2. Google Search Console/Bing Webmaster mülkiyet doğrulaması, sitemap gönderimi, IndexNow anahtarı ve gerçek indeksleme denetimi.
3. Analytics kurulumu: Cloudflare Pages yapılandırmasında Web Analytics etiketi henüz yok; kodda GA4 ölçüm ID'si yok. Kimlik ve mülkiyet doğrulanmadan sahte kimlik eklenmez. Analytics veya WhatsApp dönüşüm ölçümünde verilerin işlenmesi ve aydınlatma metni belirlenmeli.
4. Almanya'da hizmet sunumuna bağlı yasal sayfalar: `Impressum` ve `Datenschutzerklärung` için doğru işletme/meslek adresi, yasal sorumlu, kayıt bilgileri ve kullanılan dış hizmetler doğrulanmadan uydurma bilgi yayınlanmaz. Hukuki gereklilikler yerel uzmanla değerlendirilmelidir.
5. Randevu/seans ücret ve koşulları, ticari kimlik, telefon ve sosyal hesap mülkiyeti iş sahibi tarafından son kez onaylanmalı.
6. Mobil ve masaüstü PageSpeed, Lighthouse ajan denetimi, CWV ve gerçek alan adındaki 54 rota, MIME/headers, sosyal paylaşım testi alan adı aktive edildikten sonra tekrar doğrulanmalı.
7. Astro 5 sürümü kullanıcının talimatıyla korunuyor; sürüm yükseltmesi bu çalışmanın kapsamı dışında.

## Alan adı bağlandığında sıralama
1. Cloudflare Pages domain active, TLS ve www->apex 301 doğrulaması.
2. 54 sayfanın HTTP 200, canonical ve 162 karşılıklı sitemap dil alternatifini, tüm AI keşif uç noktalarını gerçek domain üzerinden test.
3. Search Console domain mülkiyet doğrulaması / sitemap ve Bing kurulum.
4. Gizlilik metinleri ve mülkiyeti doğrulanmış analitik kimliğiyle ziyaret + WhatsApp dönüşüm ölçümü; gerçek saha verileri.
5. İçerik performansı ve QCT EDGE dinamik SEO takvimi için ölçüm verisi oluşmaya başladıktan sonra karar.

## Değişiklik kapsamı
Bu otomatik kalite kapısı tasarım, içerik, Astro ana sürümü ve DNS kayıtlarını değiştirmez.

## IndexNow hazırlandı
- Kök dizine 32 haneli IndexNow doğrulama anahtarı yerleştirildi.
- `npm run indexnow:check` çevrimdışı 54 canonical URL ve anahtar dosyasını kontrol eder, hiçbir HTTP isteği göndermez.
- **Yalnızca alan adı ve HTTPS canlıya alındığında**, `npm run indexnow:submit` önce gerçek domain üzerinden anahtarı doğrular, ardından IndexNow'a bildirir.
- 200/202 yanıtları bildirim alındı demektir, indeksleme garantisi değildir.

## Dönüşüm olayları (kurulum hazırlığı)
- WhatsApp, telefon ve e-posta bağlantılarına tıklanınca tarayıcı içinde `nese:contact-intent` CustomEvent gönderilir.
- Veri alanları: `event`, `contact_method`, `page_path`, `page_language`. Telefon numarası, e-posta adresi veya mesaj gövdesi aktarılmaz.
- Bu mekanizma **ölçüm hizmeti değildir**: dış bağlantı, cookie, GA4 kimliği veya Cloudflare Web Analytics etiketi eklenmedi. Gerçek analitik entegrasyonu için hizmet kimliği, veri politikası ve gerekli yasal kontroller hâlâ gerekir.
