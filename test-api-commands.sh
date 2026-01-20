#!/bin/bash

# Готовые команды для тестирования API на продакшене
# Токен уже подставлен

API_TOKEN="026bf0c4fdbe8af4c3a3a14485c02eb160833b87758323e60fe2ac701a6f9852"
BASE_URL="https://meluviscrm.vercel.app"

echo "🚀 Тестирование API на продакшене"
echo "📍 URL: $BASE_URL"
echo "🔑 Token: ***${API_TOKEN: -4}"
echo ""
echo "=========================================="
echo ""

# 1. Получить список районов
echo "1️⃣  Получить список районов"
echo "Команда:"
echo "curl -X GET $BASE_URL/api/districts \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""
echo "Выполняю запрос..."
response=$(curl -s -L -X GET "$BASE_URL/api/districts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -X GET "$BASE_URL/api/districts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
echo "HTTP Status: $http_code"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""
echo "=========================================="
echo ""

# 2. Получить здания по району (пример с kentron)
echo "2️⃣  Получить здания по району 'kentron'"
echo "Команда:"
echo "curl -X GET $BASE_URL/api/districts-by-slug/kentron/buildings \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""
echo "Выполняю запрос..."
response=$(curl -s -L -X GET "$BASE_URL/api/districts-by-slug/kentron/buildings" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -X GET "$BASE_URL/api/districts-by-slug/kentron/buildings" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
echo "HTTP Status: $http_code"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""
echo "=========================================="
echo ""

# 3. Получить квартиры по зданию (пример с tower-1)
echo "3️⃣  Получить квартиры по зданию 'tower-1' (только доступные)"
echo "Команда:"
echo "curl -X GET \"$BASE_URL/api/buildings-by-slug/tower-1/apartments?status=available\" \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""
echo "Выполняю запрос..."
response=$(curl -s -L -X GET "$BASE_URL/api/buildings-by-slug/tower-1/apartments?status=available" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -X GET "$BASE_URL/api/buildings-by-slug/tower-1/apartments?status=available" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
echo "HTTP Status: $http_code"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""
echo "=========================================="
echo ""

# 4. Получить детали квартиры (пример ID: 1)
echo "4️⃣  Получить детали квартиры (ID: 1)"
echo "Команда:"
echo "curl -X GET $BASE_URL/api/external/apartments/1 \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""
echo "Выполняю запрос..."
response=$(curl -s -L -X GET "$BASE_URL/api/external/apartments/1" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -X GET "$BASE_URL/api/external/apartments/1" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")
echo "HTTP Status: $http_code"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""
echo "=========================================="
echo ""

# 5. Обновить статус квартиры (пример ID: 1)
echo "5️⃣  Обновить статус квартиры (ID: 1) на 'reserved'"
echo "Команда:"
echo "curl -X PUT $BASE_URL/api/apartments/1/status \\"
echo "  -H \"Authorization: Bearer $API_TOKEN\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"status\": \"reserved\"}'"
echo ""
echo "Выполняю запрос..."
response=$(curl -s -L -X PUT "$BASE_URL/api/apartments/1/status" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}')
http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -X PUT "$BASE_URL/api/apartments/1/status" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "reserved"}')
echo "HTTP Status: $http_code"
echo "$response" | jq '.' 2>/dev/null || echo "$response"
echo ""
echo "=========================================="
echo ""

echo "✅ Тестирование завершено!"
echo ""
echo "💡 Совет: Если нужно протестировать другие endpoints,"
echo "   используйте команды выше, заменив параметры (slug, id) на реальные значения"
