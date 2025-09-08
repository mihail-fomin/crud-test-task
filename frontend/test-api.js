// Простой тест API
const API_BASE = 'https://user20431889-xvds66s3.tunnel.vk-apps.com';

async function testAPI() {
  try {
    console.log('Тестируем GET запрос...');
    const response = await fetch(`${API_BASE}/products?page=1&limit=12&sort=createdAt&order=DESC`);
    
    console.log('Статус:', response.status);
    console.log('Заголовки:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Ошибка:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Данные:', data);
    
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
}

testAPI();
