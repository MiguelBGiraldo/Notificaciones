const Router = require('express');
const controllerNotificacion = require('./controller');
const MongoNotificacionDataSource = require('../../infraestructure/notificacion.datasource');

 class Notificacionroutes {

  static get routes() {

    const router = Router();

    const datasource = new MongoNotificacionDataSource();

    const controller = new controllerNotificacion(datasource);

    // Definir las rutas
    router.post('/noticacion/', controller.guardarNotificacion);
    router.get('/:id', controller.getNotificacion );
    router.get('/', controller.getNotificaciones );
    router.put('/marcacionNotifiacion/:id', controller.marcarComoLeida );
    
    // router.get('/validate-email/:token', controller.validateEmail );

    return router;
  }

}

module.exports = Notificacionroutes;