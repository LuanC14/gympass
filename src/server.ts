import { app } from './app'
import { env } from './env'


 
  
  app
    .listen({
      host: '0.0.0.0', // Descomplica a conexão de clients com a API
      port: env.PORT,
    })
    .then(() => {
      console.log('🚀 HTTP Server Running')
    })


