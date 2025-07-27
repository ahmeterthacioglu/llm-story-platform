# 📚 Madlen Hikaye Platformu

> Yapay zeka ile güçlendirilmiş hikaye oluşturma platformu - Hayal gücünüzü teknoloji ile buluşturun!

Kullanıcıların konu başlığı vererek yapay zeka yardımıyla Türkçe hikayeler oluşturabileceği ve bu hikayeleri anlama soruları ile beraber okuyabileceği modern bir web platformu.

## 🌟 Özellikler

- **🤖 Yapay Zeka Destekli Hikaye Üretimi**: OpenRouter API üzerinden Claude 3.5 Sonnet ile Türkçe hikayeler
- **📖 İnteraktif Okuma Deneyimi**: Her hikaye için özel hazırlanan çoktan seçmeli anlama soruları
- **📱 Responsive Tasarım**: Mobil ve masaüstünde mükemmel görünüm
- **⚡ Gerçek Zamanlı Feedback**: Yükleme durumları ve hata yönetimi
- **🎯 Kullanıcı Dostu Arayüz**: Sade ve anlaşılır tasarım

## 🎭 Kullanım Senaryosu

1. **Konu seçin**: "Uzayda yaşayan robot arkadaş" gibi bir konu yazın
2. **Bekleyin**: Yapay zeka sizin için özel bir hikaye oluştursun
3. **Okuyun**: Oluşturulan hikayeyi keyifle okuyun
4. **Test edin**: Anlama sorularını çözerek hikayeyi ne kadar anladığınızı ölçün

## 🏗️ Teknik Mimari

### Backend (FastAPI + SQLAlchemy)
```
📁 backend/
├── app/
│   ├── models/          # Veritabanı modelleri
│   ├── schemas/         # Pydantic veri modelleri
│   ├── services/        # İş mantığı (LLM entegrasyonu)
│   ├── routers/         # API endpoint'leri
│   └── main.py          # Ana uygulama
└── requirements.txt
```

### Frontend (React + TypeScript)
```
📁 frontend/
├── src/
│   ├── components/      # React bileşenleri
│   ├── services/        # API iletişimi
│   ├── types/           # TypeScript tip tanımları
│   └── App.tsx          # Ana uygulama
└── package.json
```

## 💡 Önemli Teknik Kararlar ve Gerekçeleri

### **FastAPI Seçimi** 🚀
Python ekosistemindeki  modern web framework'ü seçtim çünkü:
- Otomatik API dokümantasyonu (Swagger) oluşturuyor
- Type hints ile güçlü tip kontrolü sağlıyor
- Async/await desteği ile yüksek performans veriyor
- Pydantic entegrasyonu ile veri validasyonu çok kolay

### **SQLAlchemy 2.0 + SQLite** 🗄️
SQLite'ı seçmemin nedeni basitlik - tek dosyada tüm veri, kurulum yok. SQLAlchemy ise:
- Modern async ORM özellikleri
- Type safety desteği
- Kolay migration path (ileride PostgreSQL'e geçiş)
- Gelişmiş query optimization

### **OpenRouter API** 🤖
Claude API'ye direkt erişim yerine OpenRouter'ı tercih ettim çünkü:
- Tek API ile birden fazla LLM modeline erişim
- Maliyet optimizasyonu (rate limiting, fallback)
- API key yönetimi daha kolay
- Gelecekte farklı modeller deneyebilme esnekliği

### **React + TypeScript** ⚛️
TypeSript kullandım çünkü:
- Geliştirme sırasında hataları erken yakalıyor
- IDE desteği muazzam (autocomplete, refactoring)
- Büyük projelerde maintainability artıyor
- API tiplerini backend'den sync tutmak çok kolay

### **Axios vs Fetch** 🌐
Fetch yeterli olabilirdi ama Axios seçtim çünkü:
- Request/response interceptors ile merkezi error handling
- Otomatik JSON parsing
- Better error messages
- Cancel token desteği

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
- Python 3.9+
- Node.js 16+
- OpenRouter API anahtarı

### Hızlı Başlangıç

```bash
# 1. Projeyi klonlayın
git clone https://github.com/ahmeterthacioglu/llm-story-platform.git
cd llm-story-platform

# 2. Backend kurulumu
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Environment variables
echo "OPENROUTER_API_KEY=your-api-key-here" > .env
echo "ENVIRONMENT=development" >> .env

# 4. Backend'i çalıştırın
uvicorn app.main:app --reload --port 8000

# 5. Frontend kurulumu (yeni terminal)
cd frontend
npm install
npm start
```

Tarayıcınızda http://localhost:3000 adresine gidin ve hikaye oluşturmaya başlayın!

## 🌐 Canlı Demo

- **Frontend**: https://llm-story-platform.vercel.app
- **Backend API**: https://llm-story-platform-production.up.railway.app
- **API Dokümantasyonu**: https://llm-story-platform-production.up.railway.app/docs

## 🐛 Yaşanan Sorunlar ve Çözümler

### 1. **CORS Hatası** 🔥
**Problem**: Frontend'den backend'e istek gönderilemiyor  
**Çözüm**: FastAPI'de CORS middleware'ini doğru şekilde konfigüre ettik
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Bu kritik!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. **Railway Deployment Timeout** ⏱️
**Problem**: CLI ile upload çok büyük dosyalar nedeniyle zaman aşımına uğruyor  
**Çözüm**: GitHub entegrasyonu kullandık - daha güvenilir ve otomatik deploy

### 3. **Vercel Environment Variables** 🔧
**Problem**: API URL'ler production'da çalışmıyor  
**Çözüm**: Environment variable'ları Production, Preview ve Development için ayrı ayrı set ettik

### 4. **SQLAlchemy Import Hatası** 📦
**Problem**: `async_sessionmaker` import edilemiyor  
**Çözüm**: SQLAlchemy 2.0 syntax'ını kullandım ve compatibility fix'leri uyguladım

### 5. **TypeScript styled-jsx Sorunu** 💅
**Problem**: JSX içinde styling TypeScript hataları veriyor  
**Çözüm**: Ayrı CSS dosyalarına geçiş yaptım - daha temiz ve maintainable

## 📈 Gelecek Planları

- [ ] **Kullanıcı hesapları** - Kişisel hikaye koleksiyonları
- [ ] **Hikaye kategorileri** - Macera, bilim kurgu, çocuk hikayeleri
- [ ] **Ses desteği** - Text-to-speech ile hikaye dinleme
- [ ] **Sosyal özellikler** - Hikaye paylaşma ve beğenme
- [ ] **AI iyileştirmeleri** - Karakter geliştirme, hikaye devamı


## 

- **OpenRouter** - LLM API erişimi 
- **Vercel** - Frontend hosting   
- **Railway** - Backend hosting 
- **Anthropic** - Claude 3.5 Sonnet modeli 

---

**Geliştirici Notu**: Bu proje 1 günde geliştirilmiştir ve modern web development best practices'lerini göstermek amacıyla tasarlanmıştır. Gerçek production kullanımı için ek güvenlik, monitoring ve performance optimizasyonları gerekebilir.

