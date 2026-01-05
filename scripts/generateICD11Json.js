import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Generowanie icd11.json z pliku XML...');

const xmlPath = path.join(__dirname, '../public/icd11.xml');
const jsonPath = path.join(__dirname, '../public/icd11.json');

// Sprawdź czy plik XML istnieje
if (!fs.existsSync(xmlPath)) {
  console.error('❌ Plik icd11.xml nie został znaleziony:', xmlPath);
  process.exit(1);
}

try {
  // Wczytaj plik XML
  console.log('📖 Wczytywanie pliku XML...');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  
  console.log('📊 Rozmiar pliku XML:', Math.round(xmlContent.length / 1024 / 1024), 'MB');
  
  // Parsuj XML do JSON
  console.log('🔄 Parsowanie XML...');
  const entities = [];
  
  // Znajdź wszystkie elementy <element>
  const elementRegex = /<element>([\s\S]*?)<\/element>/g;
  let match;
  let processedCount = 0;
  
  while ((match = elementRegex.exec(xmlContent)) !== null) {
    const content = match[1];
    
    // Wyciągnij kod
    const codeMatch = content.match(/<code>([^<]*)<\/code>/);
    const code = codeMatch ? codeMatch[1].trim() : '';
    
    // Wyciągnij ID
    const idMatch = content.match(/<id>([^<]*)<\/id>/);
    const id = idMatch ? idMatch[1].trim() : '';
    
    // Wyciągnij tytuł (polska wersja)
    const titleMatch = content.match(/<title>[\s\S]*?<value>([^<]*)<\/value>[\s\S]*?<language>pl<\/language>[\s\S]*?<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Wyciągnij definicję (polska wersja)
    const defMatch = content.match(/<definition>[\s\S]*?<value>([^<]*)<\/value>[\s\S]*?<language>pl<\/language>[\s\S]*?<\/definition>/);
    const description = defMatch ? defMatch[1].trim() : undefined;
    
    // Dodaj do listy jeśli ma wymagane pola
    if (code && title && id) {
      entities.push({
        id,
        code,
        title,
        description: description || null
      });
      processedCount++;
      
      // Progress indicator
      if (processedCount % 1000 === 0) {
        console.log(`  📋 Przetworzono ${processedCount} elementów...`);
      }
    }
  }
  
  console.log(`✅ Przetworzono łącznie ${processedCount} elementów ICD-11`);
  
  // Sortuj według kodu
  entities.sort((a, b) => a.code.localeCompare(b.code));
  
  // Zapisz do JSON
  console.log('💾 Zapisywanie do pliku JSON...');
  const jsonData = {
    version: "2023-01",
    generatedAt: new Date().toISOString(),
    totalEntities: entities.length,
    entities: entities
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
  
  const jsonSize = fs.statSync(jsonPath).size;
  console.log(`🎉 Sukces! Wygenerowano ${jsonPath}`);
  console.log(`📊 Rozmiar JSON: ${Math.round(jsonSize / 1024 / 1024 * 100) / 100} MB`);
  console.log(`📋 Liczba elementów: ${entities.length}`);
  
  // Pokaż przykładowe elementy
  console.log('\n📝 Przykładowe elementy:');
  entities.slice(0, 3).forEach((entity, idx) => {
    console.log(`  ${idx + 1}. ${entity.code} - ${entity.title}`);
  });
  
} catch (error) {
  console.error('❌ Błąd podczas parsowania:', error);
  process.exit(1);
}