import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testowanie połączenia z bazą danych Neon...');
    
    // Test połączenia
    await prisma.$connect();
    console.log('✅ Połączono z bazą danych Neon!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log('📊 Informacje o bazie danych:', result);
    
    console.log('✅ Test połączenia zakończony pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd połączenia:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();