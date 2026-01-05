const fs = require('fs');
const path = require('path');

const calculatorsDir = 'src/components/pages';

// Get all calculator files
const files = fs.readdirSync(calculatorsDir)
  .filter(file => file.endsWith('Calculator.tsx'))
  .map(file => path.join(calculatorsDir, file));

console.log(`Found ${files.length} calculator files to fix:`);
files.forEach(file => console.log(`- ${file}`));

files.forEach(filePath => {
  console.log(`\nProcessing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove React Router imports
  if (content.includes("import { useNavigate } from 'react-router-dom';")) {
    content = content.replace(/import { useNavigate } from 'react-router-dom';\n/g, '');
    modified = true;
    console.log('  ✓ Removed useNavigate import');
  }

  // Remove jsPDF import
  if (content.includes("import jsPDF from 'jspdf';")) {
    content = content.replace(/import jsPDF from 'jspdf';\n/g, '');
    modified = true;
    console.log('  ✓ Removed jsPDF import');
  }

  // Remove Download icon from lucide-react imports if present
  if (content.includes('Download') && content.includes('lucide-react')) {
    content = content.replace(/, Download/g, '');
    content = content.replace(/Download, /g, '');
    content = content.replace(/{ Download }/g, '{}');
    modified = true;
    console.log('  ✓ Removed Download icon import');
  }

  // Remove useNavigate hook declaration
  if (content.includes('const navigate = useNavigate();')) {
    content = content.replace(/\s*const navigate = useNavigate\(\);\n/g, '');
    modified = true;
    console.log('  ✓ Removed useNavigate hook');
  }

  // Replace navigate() calls with custom navigation
  const navigatePattern = /onClick=\{\(\) => navigate\('\/kalkulatory'\)\}/g;
  if (navigatePattern.test(content)) {
    content = content.replace(navigatePattern, `onClick={() => {
                window.history.pushState({}, '', '/kalkulatory');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}`);
    modified = true;
    console.log('  ✓ Replaced navigate() calls');
  }

  // Update "Powrót do skal" to "Powrót do kalkulatorów"
  if (content.includes('Powrót do skal')) {
    content = content.replace(/Powrót do skal/g, 'Powrót do kalkulatorów');
    modified = true;
    console.log('  ✓ Updated button text');
  }

  // Remove PDF generation function (simplified approach - remove Download buttons)
  const downloadButtonPattern = /<button[^>]*onClick=\{generatePDF\}[^>]*>[\s\S]*?<\/button>/g;
  if (downloadButtonPattern.test(content)) {
    content = content.replace(downloadButtonPattern, '');
    modified = true;
    console.log('  ✓ Removed PDF download button');
  }

  // Remove generatePDF function (more complex pattern)
  const pdfFunctionPattern = /const generatePDF = \(\) => \{[\s\S]*?\};\s*/g;
  if (pdfFunctionPattern.test(content)) {
    content = content.replace(pdfFunctionPattern, '');
    modified = true;
    console.log('  ✓ Removed generatePDF function');
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ File updated successfully`);
  } else {
    console.log(`  ⚪ No changes needed`);
  }
});

console.log('\n✅ All calculator files processed!');