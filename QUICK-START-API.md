# 🚀 Быстрый старт: Интеграция с Meluvis CRM API

Минимальная инструкция для начала работы с API.

---

## 📍 Основная информация

**Базовый URL:** `https://meluviscrm.vercel.app`  
**API Token:** `026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852`

**Авторизация:** Все запросы требуют заголовок:
```
Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852
```

---

## 🔌 5 основных API Endpoints

### 1. Получить список районов

```bash
GET /api/districts
```

**Пример запроса:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
[
  {
    "id": 1,
    "slug": "kentron",
    "name": "Kentron",
    "created_at": "2026-01-19T14:27:17.070Z",
    "updated_at": "2026-01-19T14:27:17.070Z"
  }
]
```

**Важно:** Используйте `id` и `slug` из ответа для следующих запросов.

---

### 2. Получить здания по District ID

```bash
GET /api/districts/{district_id}/buildings
```

**Пример запроса:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
[
  {
    "id": 1,
    "slug": "tower-1",
    "name": "Tower 1",
    "district_id": 1,
    "district_slug": "kentron",
    "created_at": "2026-01-19T14:27:18.060Z",
    "updated_at": "2026-01-19T14:27:18.060Z"
  }
]
```

**Важно:** Используйте `id` и `slug` здания, а также `district_slug` для следующих запросов.

---

### 3. Получить квартиры по Building ID

```bash
GET /api/buildings/{building_id}/apartments
```

**Пример запроса:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**С фильтром по статусу:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "apartment_no": "12-05",
      "status": "available",
      "sqm": 52.4,
      "price_sqm": 650000,
      "total_price": 34060000,
      "building_id": 1,
      "building_slug": "tower-1",
      "district_id": 1,
      "district_slug": "kentron"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "total_pages": 1
  }
}
```

**Важно:** 
- Используйте `id` квартиры для следующих запросов
- Все ответы содержат `building_slug` и `district_slug` (не только `id`)
- Доступные статусы: `upcoming`, `available`, `reserved`, `sold`

---

### 4. Получить детали квартиры

```bash
GET /api/external/apartments/{apartment_id}
```

**Пример запроса:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
{
  "id": 1,
  "apartment_no": "12-05",
  "status": "available",
  "sqm": 52.4,
  "price_sqm": 650000,
  "total_price": 34060000,
  "building_id": 1,
  "building_slug": "tower-1",
  "district_id": 1,
  "district_slug": "kentron",
  "deal_date": null,
  "ownership_name": null,
  "email": null,
  "phone": null
}
```

**Важно:** Полная информация о квартире, включая все поля сделки.

---

### 5. Обновить статус квартиры

```bash
PUT /api/apartments/{apartment_id}/status
```

**Пример запроса:**
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

**Валидные статусы:**
- `upcoming` - Предстоящая
- `available` - Доступна
- `reserved` - Зарезервирована
- `sold` - Продана

**Ответ:**
```json
{
  "id": 1,
  "status": "reserved",
  "updated_at": "2026-01-20T13:45:01.058Z"
}
```

---

## 🔄 Типичный поток работы

1. **Получить список районов** → получить `district_id` и `district_slug`
2. **Получить здания по району** → получить `building_id` и `building_slug`
3. **Получить квартиры по зданию** → получить `apartment_id`
4. **Получить детали квартиры** → полная информация
5. **Обновить статус** → синхронизация статусов

---

## ⚠️ Важные моменты

1. **Все ответы содержат `slug`** - используйте `slug` вместо проверки `id` на вашей стороне
2. **Авторизация обязательна** - без Bearer Token получите ошибку 401
3. **Формат JSON** - все запросы и ответы в формате JSON
4. **Коды ответов:**
   - `200` - успешно
   - `401` - не авторизован (неверный токен)
   - `404` - ресурс не найден
   - `400` - ошибка валидации

---

## 📚 Дополнительная документация

Для полной документации см.:
- `API-REQUESTS-BEARER-TOKEN.md` - все API запросы с примерами
- `API-SPECIFICATION.md` - полная спецификация API
- `API-INTEGRATION-GUIDE.md` - руководство по интеграции

---

## 🧪 Тестирование

Проверьте все endpoints перед началом разработки:

```bash
# 1. Districts
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 2. Buildings
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 3. Apartments
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 4. Apartment details
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 5. Update status
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

---

**Готово к использованию!** 🎉
