# Neşe Alkaya — Resmi Web Sitesi

Astro tabanlı, Cloudflare Pages üzerinde yayınlanan Türkçe kişisel marka ve hizmet sitesi.

## Teknoloji
- Astro (statik üretim)
- Cloudflare Pages (GitHub otomatik deployment)
- Tasarım: orman yeşili, fildişi, mat altın
- SEO: canonical, Open Graph, JSON-LD, robots, sitemap ve AI discovery

## Geliştirme
```bash
npm install
npm run dev
npm run build
```

Cloudflare: `npm run build` → `dist` (Node.js 22 önerilir).

## İçerik kaynak ve doğrulama
Hakkımda bilgileri 4 Kasım 2026 tarihinde iletilen Neşe Alkaya biyografi metnine dayanır. INLPTA sertifikası, uluslararası deneyim ve manevi unvanlar üçüncü taraflarca doğrulanmış olarak temsil edilmez. Ücret, seans süresi ve gerçek portreler yayın için ayrıca netleştirilecektir.

## Önemli
Sezgisel / manevi çalışmalar bilimsel tıbbi tedavi veya kesin öngörü değildir. Sağlık, finans ve hukuk danışmanlığı yerine geçmez.

## Otomatik teknik kalite kapısı
- `npm run build` komutu statik HTML üretiminden sonra `npm run verify` çalıştırır.
- `scripts/verify-build.mjs` 54 rotanın varlığı, 16 blog, canonical, 3 hreflang, temel JSON-LD, dahili dosya bağlantıları ve ARD/SEO keşif dosyalarını denetler.
- `.github/workflows/quality.yml` aynı derleme denetimini pull request ve main branch push işlemlerinde çalıştırır.
- Kontroller derleme artefaktını doğrular; Cloudflare deployment, Lighthouse ve özel alan adı doğrulamasının yerini almaz.

## Alan adı öncesi kapsam
Bu projenin açık işleri ve alan adı geçiş kapıları için `docs/PRE_DOMAIN_RELEASE.md` dosyasına bakın.
