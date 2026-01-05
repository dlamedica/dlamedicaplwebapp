import { testConnection, db } from './lib/db.js';

async function runTests() {
  console.log('🧪 Testowanie połączenia z Neon...');
  
  // Test połączenia
  const connected = await testConnection();
  if (!connected) return;

  // Test tworzenia użytkownika
  try {
    const user = await db.user.create({
      data: {
        email: 'test@diamedica.pl',
        name: 'Test User',
        profession: 'lekarz'
      }
    });
    console.log('✅ Użytkownik utworzony:', user.id);

    // Test tworzenia zestawu fiszek
    const flashcardSet = await db.flashcardSet.create({
      data: {
        userId: user.id,
        title: 'Test - Anatomia serca',
        description: 'Testowy zestaw fiszek',
        category: 'Anatomia'
      }
    });
    console.log('✅ Zestaw fiszek utworzony:', flashcardSet.id);

    // Cleanup
    await db.flashcardSet.delete({ where: { id: flashcardSet.id } });
    await db.user.delete({ where: { id: user.id } });
    console.log('✅ Test zakończony pomyślnie!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await db.$disconnect();
  }
}

runTests();