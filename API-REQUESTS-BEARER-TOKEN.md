# 🔌 API Запросы через Bearer Token

**Базовый URL:** `https://meluviscrm.vercel.app`  
**API Token:** `026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852`

**Важно:** Все запросы требуют заголовок `Authorization: Bearer YOUR_API_TOKEN`

---

## 📋 Основные 5 API Endpoints (для внешней команды)

### 1. Districts list (GET)

Получить список всех районов.

**Endpoint:** `GET /api/districts`

**Запрос:**
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
  },
  {
    "id": 2,
    "slug": "arabkir",
    "name": "Arabkir",
    "created_at": "2026-01-19T14:27:17.683Z",
    "updated_at": "2026-01-19T14:27:17.683Z"
  }
]
```

**Поля ответа:**
- `id` (number) - ID района
- `slug` (string) - Уникальный идентификатор (используется для запросов)
- `name` (string) - Название района
- `created_at` (string, ISO 8601) - Дата создания
- `updated_at` (string, ISO 8601) - Дата обновления

---

### 2. Buildings list by District ID (GET)

Получить список всех зданий в указанном районе.

**Endpoint:** `GET /api/districts/{district_id}/buildings`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Параметры:**
- `district_id` (number, required) - ID района (получить из первого запроса)

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
  },
  {
    "id": 2,
    "slug": "tower-2",
    "name": "Tower 2",
    "district_id": 1,
    "district_slug": "kentron",
    "created_at": "2026-01-19T14:27:18.664Z",
    "updated_at": "2026-01-19T14:27:18.664Z"
  }
]
```

**Поля ответа:**
- `id` (number) - ID здания
- `slug` (string) - Уникальный идентификатор здания
- `name` (string) - Название здания
- `district_id` (number) - ID района
- `district_slug` (string) - Slug района
- `created_at` (string, ISO 8601) - Дата создания
- `updated_at` (string, ISO 8601) - Дата обновления

---

### 3. Apartments list by Building ID (GET)

Получить список всех квартир в указанном здании.

**Endpoint:** `GET /api/buildings/{building_id}/apartments`

**Запрос:**
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

**Параметры:**
- `building_id` (number, required) - ID здания (получить из второго запроса)
- `status` (string, optional) - Фильтр по статусу: `upcoming`, `available`, `reserved`, `sold`
- `page` (number, optional) - Номер страницы (по умолчанию: 1)
- `limit` (number, optional) - Количество на странице (по умолчанию: 50, максимум: 100)

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "apartment_no": "12-05",
      "apartment_type": 2,
      "status": "available",
      "sqm": 52.4,
      "price_sqm": 650000,
      "total_price": 34060000,
      "total_paid": 0,
      "balance": 34060000,
      "building_id": 1,
      "building_slug": "tower-1",
      "district_id": 1,
      "district_slug": "kentron",
      "created_at": "2026-01-19T14:27:19.476Z",
      "updated_at": "2026-01-19T14:27:19.476Z"
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

**Поля ответа:**
- `items` (array) - Массив квартир
  - `id` (number) - ID квартиры
  - `apartment_no` (string) - Номер квартиры
  - `apartment_type` (number) - Тип квартиры
  - `status` (string) - Статус: `upcoming`, `available`, `reserved`, `sold`
  - `sqm` (number) - Площадь в м²
  - `price_sqm` (number) - Цена за м² (AMD)
  - `total_price` (number) - Общая цена (AMD)
  - `total_paid` (number) - Оплачено (AMD)
  - `balance` (number) - Остаток к оплате (AMD)
  - `building_id` (number) - ID здания
  - `building_slug` (string) - Slug здания
  - `district_id` (number) - ID района
  - `district_slug` (string) - Slug района
  - `created_at` (string, ISO 8601) - Дата создания
  - `updated_at` (string, ISO 8601) - Дата обновления
- `pagination` (object) - Информация о пагинации
  - `page` (number) - Текущая страница
  - `limit` (number) - Количество на странице
  - `total` (number) - Всего квартир
  - `total_pages` (number) - Всего страниц

---

### 4. Apartment show (GET)

Получить полную информацию о квартире.

**Endpoint:** `GET /api/external/apartments/{apartment_id}`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Параметры:**
- `apartment_id` (number, required) - ID квартиры (получить из третьего запроса)

**Ответ:**
```json
{
  "id": 1,
  "apartment_no": "12-05",
  "apartment_type": 2,
  "status": "available",
  "sqm": 52.4,
  "price_sqm": 650000,
  "total_price": 34060000,
  "total_paid": 0,
  "balance": 34060000,
  "deal_date": null,
  "ownership_name": null,
  "email": null,
  "passport_tax_no": null,
  "phone": null,
  "sales_type": "unsold",
  "deal_description": null,
  "matter_link": null,
  "floorplan_distribution": null,
  "exterior_link": null,
  "exterior_link2": null,
  "building_id": 1,
  "building_slug": "tower-1",
  "building_name": "Tower 1",
  "district_id": 1,
  "district_slug": "kentron",
  "district_name": "Kentron",
  "attachments": {
    "agreement_files": [],
    "floorplans_files": [],
    "images_files": [],
    "progress_images_files": []
  },
  "created_at": "2026-01-19T14:27:19.476Z",
  "updated_at": "2026-01-19T14:27:19.476Z"
}
```

**Поля ответа:**
- Все поля из списка квартир (Endpoint 3)
- `deal_date` (string, ISO 8601 date, nullable) - Дата сделки
- `ownership_name` (string, nullable) - Имя владельца
- `email` (string, nullable) - Email
- `passport_tax_no` (string, nullable) - Паспорт/Налоговый номер
- `phone` (string, nullable) - Телефон
- `sales_type` (string) - Тип продажи: `unsold`, `mortgage`, `cash`, `timebased`
- `deal_description` (string, nullable, max 500) - Описание сделки
- `matter_link` (string, nullable) - Ссылка на Matter
- `floorplan_distribution` (string, nullable, max 500) - Распределение планировки
- `exterior_link` (string, nullable) - Внешняя ссылка 1
- `exterior_link2` (string, nullable) - Внешняя ссылка 2
- `building_name` (string) - Название здания
- `district_name` (string) - Название района
- `attachments` (object) - Вложения
  - `agreement_files` (array) - Файлы договора
  - `floorplans_files` (array) - Файлы планировок
  - `images_files` (array) - Изображения
  - `progress_images_files` (array) - Фото прогресса

---

### 5. Apartment status update (PUT)

Обновить статус квартиры.

**Endpoint:** `PUT /api/apartments/{apartment_id}/status`

**Запрос:**
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

**Параметры:**
- `apartment_id` (number, required) - ID квартиры
- Body: `{"status": "reserved"}`

**Валидные значения статуса:**
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

**Поля ответа:**
- `id` (number) - ID квартиры
- `status` (string) - Новый статус
- `updated_at` (string, ISO 8601) - Дата обновления

**Примеры запросов:**

Изменить на "reserved":
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

Изменить на "available":
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}'
```

Изменить на "sold":
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "sold"}'
```

---

## 📋 Дополнительные API Endpoints

### 6. Buildings list by District Slug (GET)

Получить список зданий по slug района (альтернатива endpoint 2).

**Endpoint:** `GET /api/districts-by-slug/{district_slug}/buildings`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts-by-slug/kentron/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Параметры:**
- `district_slug` (string, required) - Slug района (например, "kentron")

**Ответ:** Аналогичен endpoint 2

---

### 7. Apartments list by Building Slug (GET)

Получить список квартир по slug здания (альтернатива endpoint 3).

**Endpoint:** `GET /api/buildings-by-slug/{building_slug}/apartments`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**С фильтром по статусу:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**С пагинацией:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments?page=1&limit=20" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Параметры:**
- `building_slug` (string, required) - Slug здания (например, "tower-1")
- `status` (string, optional) - Фильтр по статусу
- `page` (number, optional) - Номер страницы
- `limit` (number, optional) - Количество на странице

**Ответ:** Аналогичен endpoint 3

---

### 8. District by ID (GET)

Получить информацию о районе по ID.

**Endpoint:** `GET /api/districts/{district_id}`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Примечание:** Этот endpoint требует сессию (внутренний API), не Bearer Token.

---

### 9. Building by ID (GET)

Получить информацию о здании по ID.

**Endpoint:** `GET /api/buildings/{building_id}`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Примечание:** Этот endpoint требует сессию (внутренний API), не Bearer Token.

---

### 10. Apartment by ID (GET) - Внутренний API

Получить информацию о квартире по ID (внутренний формат).

**Endpoint:** `GET /api/apartments/{apartment_id}`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Примечание:** Этот endpoint требует сессию (внутренний API), не Bearer Token. Для внешнего API используйте endpoint 4.

---

### 11. Apartment attachments (GET)

Получить список вложений квартиры.

**Endpoint:** `GET /api/apartments/{apartment_id}/attachments`

**Запрос:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/apartments/1/attachments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Примечание:** Этот endpoint требует сессию (внутренний API), не Bearer Token.

---

## 🔐 Авторизация

Все запросы требуют заголовок:
```
Authorization: Bearer YOUR_API_TOKEN
```

**Текущий токен:** `026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852`

**Важно:** 
- Токен должен быть установлен в переменных окружения Vercel (`API_TOKEN`)
- Для смены токена обновите переменную окружения в Vercel
- Старый токен перестанет работать после обновления

---

## 📊 Коды ответов

- `200 OK` - успешный запрос
- `201 Created` - успешное создание
- `400 Bad Request` - ошибка валидации
- `401 Unauthorized` - не авторизован (неверный или отсутствующий токен)
- `403 Forbidden` - нет доступа
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - ошибка сервера

---

## 🐛 Обработка ошибок

**Пример ошибки:**
```json
{
  "error": "Unauthorized"
}
```

**Причины ошибки 401:**
- Токен не указан в заголовке
- Токен указан неверно
- Токен не установлен в Vercel

**Причины ошибки 404:**
- Ресурс с указанным ID не существует
- Неверный ID в URL

---

## 💡 Полезные советы

### Красивое форматирование JSON

Добавьте `| jq '.'` в конец команды:
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" | jq '.'
```

### Показать только HTTP статус

```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o /dev/null -s
```

### Сохранить ответ в файл

```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -o districts.json
```

---

## 📝 Пример полного потока запросов

```bash
# 1. Получить список районов
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 2. Получить здания по District ID (используем ID из первого запроса, например: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 3. Получить квартиры по Building ID (используем ID из второго запроса, например: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 4. Получить детали квартиры (используем ID из третьего запроса, например: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 5. Обновить статус квартиры
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

---

**Последнее обновление:** 2026-01-20  
**Версия API:** 1.0
