// 🔒 BEZPIECZEŃSTWO: Version Header - ukrywanie wersji aplikacji

/**
 * Middleware do usuwania nagłówków ujawniających wersję aplikacji
 */
const hideVersionInfo = (req, res, next) => {
  // Usuń nagłówki które mogą ujawnić wersję
  res.removeHeader('X-Powered-By'); // Express
  res.removeHeader('Server'); // Serwer webowy
  res.removeHeader('X-AspNet-Version'); // ASP.NET
  res.removeHeader('X-AspNetMvc-Version'); // ASP.NET MVC
  
  // Dodaj generyczny nagłówek (opcjonalne)
  // res.setHeader('Server', 'WebServer'); // Generyczna nazwa
  
  next();
};

module.exports = {
  hideVersionInfo,
};

