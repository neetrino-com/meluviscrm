/**
 * Скрипт для тестирования API endpoints
 * 
 * Использование:
 * 1. Убедитесь, что сервер запущен: npm run dev
 * 2. Установите API_TOKEN в .env.local
 * 3. Запустите: tsx scripts/test-api.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Загружаем переменные окружения (сначала .env.local, потом .env)
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
  console.error('\n❌ ОШИБКА: API_TOKEN не установлен в .env или .env.local');
  console.log('   Установите API_TOKEN в .env или .env.local и попробуйте снова');
  process.exit(1);
}

interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<TestResult> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`\n🧪 Тестирую: ${name}`);
  console.log(`   ${method} ${url}`);

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    const result: TestResult = {
      name,
      endpoint,
      method,
      status: response.status,
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.error || `HTTP ${response.status}`,
    };

    if (result.success) {
      console.log(`   ✅ Успешно (${response.status})`);
      if (Array.isArray(data)) {
        console.log(`   📊 Получено записей: ${data.length}`);
      } else if (data.items && Array.isArray(data.items)) {
        console.log(`   📊 Получено записей: ${data.items.length}`);
      } else if (data.id) {
        console.log(`   📊 ID: ${data.id}`);
      }
    } else {
      console.log(`   ❌ Ошибка (${response.status}): ${result.error}`);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`   ❌ Ошибка подключения: ${errorMessage}`);
    
    return {
      name,
      endpoint,
      method,
      status: 0,
      success: false,
      error: errorMessage,
    };
  }
}

async function runTests() {
  console.log('🚀 Начинаю тестирование API...');
  console.log(`📍 Базовый URL: ${API_BASE_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? '***' + API_TOKEN.slice(-4) : 'НЕ УСТАНОВЛЕН'}`);

  // Тест 1: Получить список районов
  results.push(
    await testEndpoint(
      '1. Получить список районов',
      '/api/districts'
    )
  );

  // Ждём немного между запросами
  await new Promise(resolve => setTimeout(resolve, 500));

  // Тест 2: Получить здания по District ID (нужен реальный ID из первого теста)
  const districts = results[0].data;
  if (districts && Array.isArray(districts) && districts.length > 0) {
    const districtId = districts[0].id;
    results.push(
      await testEndpoint(
        '2. Получить здания по District ID',
        `/api/districts/${districtId}/buildings`
      )
    );

    await new Promise(resolve => setTimeout(resolve, 500));

    // Тест 3: Получить квартиры по Building ID (нужен реальный ID из второго теста)
    const buildings = results[1].data;
    if (buildings && Array.isArray(buildings) && buildings.length > 0) {
      const buildingId = buildings[0].id;
      results.push(
        await testEndpoint(
          '3. Получить квартиры по Building ID',
          `/api/buildings/${buildingId}/apartments`
        )
      );

      await new Promise(resolve => setTimeout(resolve, 500));

      // Тест 4: Получить детали квартиры (нужен реальный ID из третьего теста)
      const apartments = results[2].data;
      if (apartments && apartments.items && Array.isArray(apartments.items) && apartments.items.length > 0) {
        const apartmentId = apartments.items[0].id;
        results.push(
          await testEndpoint(
            '4. Получить детали квартиры',
            `/api/external/apartments/${apartmentId}`
          )
        );

        await new Promise(resolve => setTimeout(resolve, 500));

        // Тест 5: Обновить статус квартиры
        results.push(
          await testEndpoint(
            '5. Обновить статус квартиры',
            `/api/apartments/${apartmentId}/status`,
            'PUT',
            { status: 'reserved' }
          )
        );

        await new Promise(resolve => setTimeout(resolve, 500));

        // Тест 6: Вернуть статус обратно
        results.push(
          await testEndpoint(
            '6. Вернуть статус обратно',
            `/api/apartments/${apartmentId}/status`,
            'PUT',
            { status: 'available' }
          )
        );
      } else {
        console.log('\n⚠️  Пропущены тесты 4-6: нет квартир в здании');
      }
    } else {
      console.log('\n⚠️  Пропущены тесты 3-6: нет зданий в районе');
    }
  } else {
    console.log('\n⚠️  Пропущены тесты 2-6: нет районов в базе данных');
    console.log('   Создайте тестовые данные: npm run db:seed-data');
  }

  // Итоговая статистика
  console.log('\n' + '='.repeat(60));
  console.log('📊 ИТОГОВАЯ СТАТИСТИКА');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Успешных тестов: ${successful}`);
  console.log(`❌ Провалившихся тестов: ${failed}`);
  console.log(`📈 Всего тестов: ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ ПРОВАЛИВШИЕСЯ ТЕСТЫ:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.name}`);
        console.log(`     ${r.method} ${r.endpoint}`);
        console.log(`     Ошибка: ${r.error}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  // Возвращаем код выхода
  process.exit(failed > 0 ? 1 : 0);
}

// Запускаем тесты
runTests().catch(error => {
  console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
  process.exit(1);
});
