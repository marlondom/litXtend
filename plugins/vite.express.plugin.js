console.log('expressPlugin.js carregado');

export default function expressPlugin (app) {
    return {
      name: 'express-plugin',
      configureServer (server) {
        console.log('expressPlugin base:', server.config.base);
        if (server.config.base !== '/') {
          server.middlewares.use(server.config.base, app);
        }
        server.middlewares.use(app);
      },
    };
  }
  