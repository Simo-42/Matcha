const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Matcha API',
    description: 'API for the application Matcha',
    version: '1.0.0',
  },
  host: 'localhost:3005',  // URL de base de votre API
  schemes: ['http'],       // Peut être http ou https
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./routes/index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');  // Remplacez par votre fichier serveur principal
});
