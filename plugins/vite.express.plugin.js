export default function expressPlugin (app) {
    return {
      name: 'express-plugin',
      configureServer (server) {
        if (server.config.base !== '/') {
          server.middlewares.use(server.config.base, app);
        }
        server.middlewares.use(app);
      },
    };
  }
  