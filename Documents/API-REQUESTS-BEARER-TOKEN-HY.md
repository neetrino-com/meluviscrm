# 🔌 API Հարցումներ Bearer Token-ով

**Հիմնական URL:** `https://meluviscrm.vercel.app`  
**API Token:** `026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852`

**Կարևոր:** Բոլոր հարցումները պահանջում են `Authorization: Bearer YOUR_API_TOKEN` վերնագիր

---

## 📋 Հիմնական 5 API Endpoints (արտաքին թիմի համար)

### 1. Districts list (GET)

Ստանալ բոլոր թաղամասերի ցուցակը:

**Endpoint:** `GET /api/districts`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պատասխան:**
```json
{
  "data": [
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
}
```

**Պատասխանի դաշտեր:**
- `data` (array) - Թաղամասերի զանգված
  - `id` (number) - Թաղամասի ID
  - `slug` (string) - Եզակի նույնականացուցիչ (օգտագործվում է հարցումների համար)
  - `name` (string) - Թաղամասի անվանում
  - `created_at` (string, ISO 8601) - Ստեղծման ամսաթիվ
  - `updated_at` (string, ISO 8601) - Թարմացման ամսաթիվ

---

### 2. Buildings list by District ID (GET)

Ստանալ նշված թաղամասում գտնվող բոլոր շենքերի ցուցակը:

**Endpoint:** `GET /api/districts/{district_id}/buildings`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պարամետրեր:**
- `district_id` (number, required) - Թաղամասի ID (ստանալ առաջին հարցումից)

**Պատասխան:**
```json
{
  "data": [
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
}
```

**Պատասխանի դաշտեր:**
- `data` (array) - Շենքերի զանգված
  - `id` (number) - Շենքի ID
  - `slug` (string) - Շենքի եզակի նույնականացուցիչ
  - `name` (string) - Շենքի անվանում
  - `district_id` (number) - Թաղամասի ID
  - `district_slug` (string) - Թաղամասի slug
  - `created_at` (string, ISO 8601) - Ստեղծման ամսաթիվ
  - `updated_at` (string, ISO 8601) - Թարմացման ամսաթիվ

---

### 3. Apartments list by Building ID (GET)

Ստանալ նշված շենքում գտնվող բոլոր բնակարանների ցուցակը:

**Endpoint:** `GET /api/buildings/{building_id}/apartments`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Կարգավիճակով ֆիլտր:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պարամետրեր:**
- `building_id` (number, required) - Շենքի ID (ստանալ երկրորդ հարցումից)
- `status` (string, optional) - Կարգավիճակի ֆիլտր: `upcoming`, `available`, `reserved`, `sold`
- `page` (number, optional) - Էջի համար (լռելյայն: 1)
- `limit` (number, optional) - Էջում գտնվող քանակ (լռելյայն: 50, առավելագույն: 100)

**Պատասխան:**
```json
{
  "data": {
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
        "deal_date": null,
        "ownership_name": null,
        "email": null,
        "passport_tax_no": null,
        "phone": null,
        "building_id": 1,
        "building_slug": "tower-1",
        "district_id": 1,
        "district_slug": "kentron",
        "attachments": [
          {
            "id": 1,
            "fileType": "FLOORPLAN",
            "fileUrl": "https://...",
            "fileName": "floorplan.pdf",
            "fileSize": 12345,
            "md5Hash": "5d41402abc4b2a76b9719d911017c592",
            "createdAt": "2026-01-15T10:00:00Z"
          }
        ],
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
}
```

**Պատասխանի դաշտեր:**
- `data` (object) - Տվյալների օբյեկտ
  - `items` (array) - Բնակարանների զանգված
  - `id` (number) - Բնակարանի ID
  - `apartment_no` (string) - Բնակարանի համար
  - `apartment_type` (number) - Բնակարանի տիպ
  - `status` (string) - Կարգավիճակ: `upcoming`, `available`, `reserved`, `sold`
  - `sqm` (number) - Տարածք մ²-ով
  - `price_sqm` (number) - Գին մ²-ի համար (AMD)
  - `total_price` (number) - Ընդհանուր գին (AMD)
  - `total_paid` (number) - Վճարված (AMD)
  - `balance` (number) - Մնացորդ վճարման համար (AMD)
  - `deal_date` (string, ISO 8601 date, nullable) - Գործարքի ամսաթիվ
  - `ownership_name` (string, nullable) - Սեփականատիրոջ անուն
  - `email` (string, nullable) - Email
  - `passport_tax_no` (string, nullable) - Անձնագիր/Հարկային համար
  - `phone` (string, nullable) - Հեռախոս
  - `building_id` (number) - Շենքի ID
  - `building_slug` (string) - Շենքի slug
  - `district_id` (number) - Թաղամասի ID
  - `district_slug` (string) - Թաղամասի slug
  - `attachments` (array) - Կցված ֆայլերի զանգված (նույն ձևաչափը, ինչ endpoint 4-ում)
  - `created_at` (string, ISO 8601) - Ստեղծման ամսաթիվ
  - `updated_at` (string, ISO 8601) - Թարմացման ամսաթիվ
  - `pagination` (object) - Էջավորման տեղեկատվություն
  - `page` (number) - Ընթացիկ էջ
  - `limit` (number) - Էջում գտնվող քանակ
  - `total` (number) - Ընդհանուր բնակարաններ
  - `total_pages` (number) - Ընդհանուր էջեր

---

### 4. Apartment show (GET)

Ստանալ բնակարանի մասին ամբողջական տեղեկատվություն:

**Endpoint:** `GET /api/external/apartments/{apartment_id}`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պարամետրեր:**
- `apartment_id` (number, required) - Բնակարանի ID (ստանալ երրորդ հարցումից)

**Պատասխան:**
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
  "attachments": [
    {
      "id": 1,
      "fileType": "FLOORPLAN",
      "fileUrl": "https://...",
      "fileName": "floorplan.pdf",
      "fileSize": 12345,
      "md5Hash": "5d41402abc4b2a76b9719d911017c592",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "created_at": "2026-01-19T14:27:19.476Z",
  "updated_at": "2026-01-19T14:27:19.476Z"
}
```

**Պատասխանի դաշտեր:**
- Բոլոր դաշտերը բնակարանների ցուցակից (Endpoint 3)
- `deal_date` (string, ISO 8601 date, nullable) - Գործարքի ամսաթիվ
- `ownership_name` (string, nullable) - Սեփականատիրոջ անուն
- `email` (string, nullable) - Email
- `passport_tax_no` (string, nullable) - Անձնագիր/Հարկային համար
- `phone` (string, nullable) - Հեռախոս
- `sales_type` (string) - Վաճառքի տիպ: `unsold`, `mortgage`, `cash`, `timebased`
- `deal_description` (string, nullable, max 500) - Գործարքի նկարագրություն
- `matter_link` (string, nullable) - Matter-ի հղում
- `floorplan_distribution` (string, nullable, max 500) - Պլանավորման բաշխում
- `exterior_link` (string, nullable) - Արտաքին հղում 1
- `exterior_link2` (string, nullable) - Արտաքին հղում 2
- `building_name` (string) - Շենքի անվանում
- `district_name` (string) - Թաղամասի անվանում
- `attachments` (array) - Կցված ֆայլերի զանգված
  - `id` (number) - Կցված ֆայլի ID
  - `fileType` (string) - Ֆայլի տիպ: `AGREEMENT`, `FLOORPLAN`, `IMAGE`, `PROGRESS_IMAGE`
  - `fileUrl` (string) - Ֆայլի URL ներբեռնման համար
  - `fileName` (string, nullable) - Ֆայլի անվանում
  - `fileSize` (number, nullable) - Ֆայլի չափը բայթերով
  - `md5Hash` (string, nullable) - Ֆայլի MD5 հեշ (32 նիշ) - **օգտագործվում է ստուգելու համար, արդյոք անհրաժեշտ է ներբեռնել ֆայլը**
  - `createdAt` (string, ISO 8601) - Ստեղծման ամսաթիվ

---

### 5. Apartment status update (PUT)

Թարմացնել բնակարանի կարգավիճակը և գործարքի տվյալները:

**Endpoint:** `PUT /api/apartments/{apartment_id}/status`

**Հարցում (միայն կարգավիճակ):**
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

**Հարցում (կարգավիճակ + գործարքի տվյալներ):**
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sold",
    "deal_date": "2026-01-20",
    "ownership_name": "John Doe",
    "email": "john@example.com",
    "passport_tax_no": "123456789",
    "phone": "+37412345678"
  }'
```

**Պարամետրեր:**
- `apartment_id` (number, required) - Բնակարանի ID
- Body (JSON):
  - `status` (string, required) - Նոր կարգավիճակ
  - `deal_date` (string, optional, ISO 8601 date) - Գործարքի ամսաթիվ (ձևաչափ: YYYY-MM-DD)
  - `ownership_name` (string, optional) - Սեփականատիրոջ անուն
  - `email` (string, optional) - Email
  - `passport_tax_no` (string, optional) - Անձնագիր/Հարկային համար
  - `phone` (string, optional) - Հեռախոս

**Վավեր կարգավիճակի արժեքներ:**
- `upcoming` - Առաջիկա
- `available` - Հասանելի
- `reserved` - Պահված
- `sold` - Վաճառված

**Պատասխան:**
```json
{
  "id": 1,
  "status": "sold",
  "deal_date": "2026-01-20",
  "ownership_name": "John Doe",
  "email": "john@example.com",
  "passport_tax_no": "123456789",
  "phone": "+37412345678",
  "updated_at": "2026-01-20T13:45:01.058Z"
}
```

**Պատասխանի դաշտեր:**
- `id` (number) - Բնակարանի ID
- `status` (string) - Նոր կարգավիճակ
- `deal_date` (string, ISO 8601 date, nullable) - Գործարքի ամսաթիվ
- `ownership_name` (string, nullable) - Սեփականատիրոջ անուն
- `email` (string, nullable) - Email
- `passport_tax_no` (string, nullable) - Անձնագիր/Հարկային համար
- `phone` (string, nullable) - Հեռախոս
- `updated_at` (string, ISO 8601) - Թարմացման ամսաթիվ

**Հարցումների օրինակներ:**

Փոխել միայն կարգավիճակը "reserved"-ի:
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

Փոխել կարգավիճակը և ավելացնել գործարքի տվյալներ:
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sold",
    "deal_date": "2026-01-20",
    "ownership_name": "John Doe",
    "email": "john@example.com",
    "passport_tax_no": "123456789",
    "phone": "+37412345678"
  }'
```

Փոխել "available"-ի:
```bash
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "available"}'
```

---

## 📋 Լրացուցիչ API Endpoints

### 6. Buildings list by District Slug (GET)

Ստանալ շենքերի ցուցակը թաղամասի slug-ով (endpoint 2-ի այլընտրանք):

**Endpoint:** `GET /api/districts-by-slug/{district_slug}/buildings`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts-by-slug/kentron/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պարամետրեր:**
- `district_slug` (string, required) - Թաղամասի slug (օրինակ, "kentron")

**Պատասխան:** Նման է endpoint 2-ին

---

### 7. Apartments list by Building Slug (GET)

Ստանալ բնակարանների ցուցակը շենքի slug-ով (endpoint 3-ի այլընտրանք):

**Endpoint:** `GET /api/buildings-by-slug/{building_slug}/apartments`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Կարգավիճակով ֆիլտր:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Էջավորմամբ:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings-by-slug/tower-1/apartments?page=1&limit=20" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Պարամետրեր:**
- `building_slug` (string, required) - Շենքի slug (օրինակ, "tower-1")
- `status` (string, optional) - Կարգավիճակի ֆիլտր
- `page` (number, optional) - Էջի համար
- `limit` (number, optional) - Էջում գտնվող քանակ

**Պատասխան:** Նման է endpoint 3-ին

---

### 8. District by ID (GET)

Ստանալ թաղամասի մասին տեղեկատվություն ID-ով:

**Endpoint:** `GET /api/districts/{district_id}`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Նշում:** Այս endpoint-ը պահանջում է սեսիա (ներքին API), ոչ Bearer Token:

---

### 9. Building by ID (GET)

Ստանալ շենքի մասին տեղեկատվություն ID-ով:

**Endpoint:** `GET /api/buildings/{building_id}`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Նշում:** Այս endpoint-ը պահանջում է սեսիա (ներքին API), ոչ Bearer Token:

---

### 10. Apartment by ID (GET) - Ներքին API

Ստանալ բնակարանի մասին տեղեկատվություն ID-ով (ներքին ձևաչափ):

**Endpoint:** `GET /api/apartments/{apartment_id}`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Նշում:** Այս endpoint-ը պահանջում է սեսիա (ներքին API), ոչ Bearer Token: Արտաքին API-ի համար օգտագործեք endpoint 4:

---

### 11. Apartment attachments (GET)

Ստանալ բնակարանի կցված ֆայլերի ցուցակը:

**Endpoint:** `GET /api/apartments/{apartment_id}/attachments`

**Հարցում:**
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/apartments/1/attachments" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"
```

**Նշում:** Այս endpoint-ը պահանջում է սեսիա (ներքին API), ոչ Bearer Token:

---

## 🔐 Վավերացում

Բոլոր հարցումները պահանջում են վերնագիր:
```
Authorization: Bearer YOUR_API_TOKEN
```

**Ընթացիկ token:** `026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852`

**Կարևոր:** 
- Token-ը պետք է տեղադրված լինի Vercel-ի շրջակա փոփոխականներում (`API_TOKEN`)
- Token-ը փոխելու համար թարմացրեք շրջակա փոփոխականը Vercel-ում
- Հին token-ը կդադարի աշխատել թարմացումից հետո

---

## 📊 Պատասխանի կոդեր

- `200 OK` - հաջող հարցում
- `201 Created` - հաջող ստեղծում
- `400 Bad Request` - վավերացման սխալ
- `401 Unauthorized` - չվավերացված (սխալ կամ բացակայող token)
- `403 Forbidden` - մուտք չկա
- `404 Not Found` - ռեսուրսը չի գտնվել
- `500 Internal Server Error` - սերվերի սխալ

---

## 🐛 Սխալների մշակում

**Սխալի օրինակ:**
```json
{
  "error": "Unauthorized"
}
```

**401 սխալի պատճառներ:**
- Token-ը նշված չէ վերնագրում
- Token-ը սխալ է նշված
- Token-ը տեղադրված չէ Vercel-ում

**404 սխալի պատճառներ:**
- Նշված ID-ով ռեսուրսը գոյություն չունի
- URL-ում սխալ ID

---

## 💡 Օգտակար խորհուրդներ

### Գեղեցիկ JSON ձևաչափում

Ավելացրեք `| jq '.'` հրամանի վերջում:
```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" | jq '.'
```

### Ցույց տալ միայն HTTP կարգավիճակ

```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o /dev/null -s
```

### Պահպանել պատասխանը ֆայլում

```bash
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -o districts.json
```

---

## 📝 Ամբողջական հարցումների հոսքի օրինակ

```bash
# 1. Ստանալ թաղամասերի ցուցակ
curl -L -X GET "https://meluviscrm.vercel.app/api/districts" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 2. Ստանալ շենքերը District ID-ով (օգտագործում ենք առաջին հարցումից ստացված ID, օրինակ: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/districts/1/buildings" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 3. Ստանալ բնակարանները Building ID-ով (օգտագործում ենք երկրորդ հարցումից ստացված ID, օրինակ: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/buildings/1/apartments?status=available" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 4. Ստանալ բնակարանի մանրամասները (օգտագործում ենք երրորդ հարցումից ստացված ID, օրինակ: 1)
curl -L -X GET "https://meluviscrm.vercel.app/api/external/apartments/1" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json"

# 5. Թարմացնել բնակարանի կարգավիճակը
curl -L -X PUT "https://meluviscrm.vercel.app/api/apartments/1/status" \
  -H "Authorization: Bearer 026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}'
```

---

---

## 🔐 MD5 Հեշ ֆայլերի համար

### Ինչ է MD5-ը?

MD5-ը ֆայլի եզակի "հետք" է (32 նիշանոց տող): Նույն ֆայլի համար միշտ ստացվում է նույն MD5-ը:

### Ինչու է դա անհրաժեշտ?

MD5-ը թույլ է տալիս հաճախորդին ստուգել, արդյոք նա արդեն ունի այս ֆայլը, և ներբեռնել միայն նոր կամ փոփոխված ֆայլերը: Սա խնայում է տրաֆիկը և նվազեցնում է սերվերի բեռը:

### Ինչպես օգտագործել MD5-ը?

**Օգտագործման օրինակ հաճախորդի կողմից:**

```typescript
// 1. Ստանալ ֆայլերի ցուցակը MD5-ով
const response = await fetch('/api/external/apartments/501', {
  headers: { 'Authorization': 'Bearer TOKEN' }
});
const apartment = await response.json();

// 2. Յուրաքանչյուր ֆայլի համար ստուգել, արդյոք այն գոյություն ունի տեղականորեն
for (const attachment of apartment.attachments) {
  // Հաշվարկել տեղական ֆայլի MD5-ը (եթե այն գոյություն ունի)
  const localMD5 = await calculateLocalFileMD5(attachment.fileName);
  
  // Համեմատել MD5-ները
  if (localMD5 !== attachment.md5Hash) {
    // Ֆայլը նոր է կամ փոփոխվել է → ներբեռնել
    await downloadFile(attachment.fileUrl, attachment.fileName);
  } else {
    // Ֆայլը արդեն գոյություն ունի → բաց թողնել
    console.log(`File ${attachment.fileName} already exists, skipping...`);
  }
}
```

**Ինչպես հաշվարկել MD5-ը տեղականորեն:**

- **Node.js:** Օգտագործեք `crypto` գրադարանը:
  ```javascript
  const crypto = require('crypto');
  const fs = require('fs');
  
  const fileBuffer = fs.readFileSync('path/to/file');
  const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
  ```

- **Python:** Օգտագործեք `hashlib` գրադարանը:
  ```python
  import hashlib
  
  with open('path/to/file', 'rb') as f:
      file_hash = hashlib.md5(f.read()).hexdigest()
  ```

- **Bash:** Օգտագործեք `md5sum` հրամանը:
  ```bash
  md5sum path/to/file
  ```

### Կարևոր կետեր

- `md5Hash` դաշտը կարող է լինել `null` հին ֆայլերի համար (MD5-ի ներդրումից առաջ)
- Եթե `md5Hash`-ը `null` է, հաճախորդը պետք է ներբեռնի ֆայլը ստուգման համար
- MD5-ը ավտոմատ կերպով հաշվարկվում է նոր ֆայլերի վերբեռնման ժամանակ
- Գոյություն ունեցող ֆայլերի համար MD5-ը հաշվարկվում է միգրացիայի սկրիպտի միջոցով

---

**Վերջին թարմացում:** 2026-01-26  
**API-ի տարբերակ:** 1.0
