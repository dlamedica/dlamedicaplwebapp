import http from 'http'

console.log('🌐 Testowanie czy serwer odpowiada poprawnie...')

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/',
  method: 'GET',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (compatible; test-client)'
  }
}

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`)
  console.log('Headers:', res.headers)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log('Response length:', data.length)
    console.log('Content type:', res.headers['content-type'])
    
    if (data.includes('<div id="root">')) {
      console.log('✅ HTML zawiera element #root')
    } else {
      console.log('❌ Brak elementu #root w HTML')
    }
    
    if (data.includes('main.tsx')) {
      console.log('✅ HTML zawiera odniesienie do main.tsx')
    } else {
      console.log('❌ Brak odniesienia do main.tsx')
    }
    
    if (data.includes('<!doctype html>')) {
      console.log('✅ To jest prawidłowy HTML')
    } else {
      console.log('❌ To nie jest prawidłowy HTML')
    }
    
    // Pokaż pierwsze 500 znaków
    console.log('\nPierwsze 500 znaków odpowiedzi:')
    console.log(data.substring(0, 500) + '...')
  })
})

req.on('error', (e) => {
  console.error('❌ Błąd żądania:', e.message)
})

req.setTimeout(5000, () => {
  console.error('❌ Timeout - serwer nie odpowiada')
  req.destroy()
})

req.end()