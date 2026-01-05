import { exec } from 'child_process'

console.log('🔧 Testowanie czy Vite może zbudować aplikację...')

exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Błąd build:', error.message)
    return
  }
  
  if (stderr) {
    console.error('⚠️ Stderr:', stderr)
  }
  
  console.log('✅ Build output:')
  console.log(stdout)
  
  console.log('✅ Aplikacja może zostać zbudowana - problem nie jest w kodzie TypeScript')
})