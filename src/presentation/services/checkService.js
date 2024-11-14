
class CheckService {

    constructor(notificacionDatasource, succesCallback, errorCallback) {
        this.notificacionDatasource = notificacionDatasource;
        this.succesCallback = succesCallback;
        this.errorCallback = errorCallback;
    }

    async execute(options) {

        try {
            await this.notificacionDatasource.saveNotificacion(options);
            if (this.succesCallback) this.succesCallback();
            
            return {
                ok: true
            };

        } catch (error) {

            const log = {
                application: "Notificaciones",
                level: "high",
                className: "CheckService",
                summary: "Error interno",
                description: `Se produjo un error interno, el cual dice: ${error} `

            }
            // await this.logDatasource.saveLog(log); Se envía a la aplicación de logs.

            if (this.errorCallback) this.errorCallback(`${error}`);

            console.log(error)

            return {
                ok: false,
                error
            }
            // throw new Error(error);
        }
    }
}

module.exports = CheckService; // Exporta la clase
