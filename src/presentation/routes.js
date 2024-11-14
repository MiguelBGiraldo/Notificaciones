const { Router }  =  require( 'express');

const Notificacionroutes = require('./notificacion/routes');




class AppRoutes {

  static get routes() {

    const router = Router();

    // Definir las rutas
    router.use('/api/notificaciones', Notificacionroutes.routes);

    return router;
  }

}

module.exports = AppRoutes