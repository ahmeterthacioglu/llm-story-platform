# 📚 Madlen Hikaye Platformu

LLM destekli hikaye üretme platformu - Kullanıcıların web arayüzü üzerinden yapay zeka yardımıyla hikayeler oluşturabileceği ve okuyabileceği modern bir web uygulaması.

## ✨ Özellikler

- **Hikaye Listesi**: Tüm hikayeleri kronolojik sırayla görüntüleme
- **Hikaye Detayı**: Hikayeleri okuma ve anlama sorularını çözme
- **Yapay Zeka ile Hikaye Üretimi**: Konu başlığı vererek yeni hikayeler oluşturma
- **İnteraktif Quiz**: Her hikaye için otomatik oluşturulan anlama soruları
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **Gerçek Zamanlı Feedback**: Yükleme durumu ve hata yönetimi

## 🏗️ Teknoloji Stack

### Backend
- **FastAPI**: Modern, hızlı Python web framework
- **SQLAlchemy**: Async ORM for database operations
- **SQLite**: Hafif, dosya tabanlı veritabanı
- **Pydantic**: Veri validasyonu ve serialization
- **OpenRouter**: LLM API erişimi

### Frontend
- **React 18**: Modern component-based UI library
- **TypeScript**: Type-safe JavaScript development
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS-in-JS**: Scoped styling with styled-jsx

## 📋 Gereksinimler

- Python 3.8+
- Node.js 16+
- npm veya yarn
- OpenRouter API anahtarı

## 🚀 Kurulum

### 1. Projeyi klonlayın
```bash
git clone <repo-url>
cd madlen-story-platform
```

### 2. Backend Kurulumu

```bash
cd backend

# Virtual environment oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies'leri yükleyin
pip install -r requirements.txt

# Environment variables
cp .env.example .env
# .env dosyasını düzenleyip OPENROUTER_API_KEY'i ekleyin
```

### 3. Frontend Kurulumu

```bash
cd frontend

# Dependencies'leri yükleyin
npm install
```

### 4. Uygulamayı Çalıştırın

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 5. Uygulamaya Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Önemli Teknik Kararlar

### Backend Tasarım Kararları

**FastAPI Seçimi**: 
- Otomatik API dokümantasyonu (OpenAPI/Swagger)
- Type hints desteği ve runtime validasyon
- Async/await desteği ile yüksek performans
- Modern Python web development best practices

**SQLAlchemy + SQLite**:
- SQLite: Basit kurulum, dosya tabanlı, development friendly
- SQLAlchemy: Modern ORM, async desteği, type safety
- Kolay migration path diğer veritabanlarına (PostgreSQL, MySQL)

**Pydantic Schemas**:
- Request/response validasyonu
- Automatic serialization/deserialization
- Type safety ve IDE support

**OpenRouter Integration**:
- Multiple LLM models access
- Unified API interface
- Cost-effective compared to direct model APIs

### Frontend Tasarım Kararları

**React + TypeScript**:
- Component-based architecture
- Type safety throughout the application
- Excellent developer experience
- Large ecosystem and community support

**React Router**:
- Declarative routing
- Client-side navigation
- URL-based state management

**Axios over Fetch**:
- Request/response interceptors
- Better error handling
- Automatic JSON parsing
- Request/response transformation

**CSS-in-JS (styled-jsx)**:
- Component-scoped styles
- No CSS conflicts
- Dynamic styling based on props/state
- Better maintainability

### LLM Integration Strategy

**Structured Output**:
- JSON format responses from LLM
- Pydantic validation for reliability
- Error handling for malformed responses
- Retry logic for failed requests

**Question Generation**:
- Consistent format (multiple choice)
- Turkish language support
- Comprehension-based questions
- Automatic scoring system

## 📁 Proje Yapısı

```
madlen-story-platform/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── routers/         # API endpoints
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔗 API Endpoints

### Stories API

- `GET /api/stories/` - Tüm hikayeleri listele
- `GET /api/stories/{id}` - Belirli hikayeyi getir
- `POST /api/stories/generate` - Yeni hikaye oluştur

### Example API Usage

```bash
# Hikaye oluştur
curl -X POST "http://localhost:8000/api/stories/generate" \
     -H "Content-Type: application/json" \
     -d '{"topic": "Uzayda yaşayan arkadaş robot"}'

# Hikayeleri listele
curl "http://localhost:8000/api/stories/"

# Hikaye detayı
curl "http://localhost:8000/api/stories/1"
```

## 🧪 Test

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
npm run build
# Deploy build/ directory to your static hosting
```

### Environment Variables
```bash
# Production .env
OPENROUTER_API_KEY=your_production_key
DATABASE_URL=postgresql://user:pass@host:port/db  # For PostgreSQL
ENVIRONMENT=production
```

## 🐛 Bilinen Sorunlar ve Çözümler

### LLM Response Parsing
- **Sorun**: LLM bazen geçersiz JSON dönebilir
- **Çözüm**: Pydantic validation ve error handling
- **İyileştirme**: Retry logic ve fallback responses

### CORS Issues
- **Sorun**: Development'ta CORS hataları
- **Çözüm**: FastAPI CORS middleware configured
- **Not**: Production'da proper CORS setup gerekli

### Database Migrations
- **Mevcut**: SQLAlchemy create_all() on startup
- **İyileştirme**: Alembic migrations for production

## 📈 Gelecek İyileştirmeler

1. **User Authentication**: Kullanıcı hesapları ve kişisel hikayeler
2. **Story Categories**: Hikaye kategorileri ve filtreleme
3. **Advanced Quiz**: Multiple question types, difficulty levels
4. **Story Sharing**: Social features, story sharing
5. **Performance**: Caching, pagination, lazy loading
6. **Mobile App**: React Native implementation
7. **AI Features**: Story continuation, character generation

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues açın
2. Logs'ları kontrol edin
3. Environment variables'ları doğrulayın
4. API key'in geçerli olduğundan emin olun

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

**Geliştirici Notları**: Bu proje modern web development best practices'lerini göstermek amacıyla tasarlanmıştır. Production kullanımı için ek güvenlik, monitoring ve performance optimizasyonları gerekebilir.