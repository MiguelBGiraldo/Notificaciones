const NotificacionModel = require("../data/models/notificacion.model");



class MongoNotificacionDataSource {

    async saveNotificacion(not) {
        console.log("Notificacion: \n" + not);
        const newNotificacion = await NotificacionModel.create(not);
        console.log('Mongo Notificacion Created', newNotificacion.id);


    }

    async getNotificacion(id) {
        const logs = await NotificacionModel.find({
            id
        });
        return logs; // Devuelve los logs directamente
    }

    async getNotificaciones(page, limit, startDate, endDate, filtro = {}) {
        const skip = (page - 1) * limit;

        // Obtener los nombres de los campos válidos del esquema
        const camposValidos = Object.keys(NotificacionModel.schema.paths);

        // Filtrar las claves no válidas en el filtro
        const filtroValido = Object.keys(filtro).reduce((acc, key) => {
            if (camposValidos.includes(key)) {
                acc[key] = filtro[key];
            }
            return acc;
        }, {});

        // Verificar si startDate y endDate son válidos y no nulos
        if (startDate && endDate) {
            // Convertir startDate y endDate a tipo Date y establecer a inicio y fin del día
            const fechaInicio = new Date(`${startDate}T00:00:00.000Z`);
            const fechaFin = new Date(`${endDate}T23:59:59.999Z`);

            // Verificar si startDate es mayor que endDate
            if (fechaInicio > fechaFin) {
                throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin.");
            }

            // Agregar el rango de fechas al filtro
            filtroValido.createdAt = {
                $gte: fechaInicio,
                $lte: fechaFin
            };
        }

        // Obtener logs ordenados por fecha, aplicando paginación y filtro validado
        const logs = await NotificacionModel.find(filtroValido)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return logs;
    }

    async marcarNotificacionComoLeida(id) {

        // Buscar la notificación por su ID y actualizar el campo 'leida' a true
        const resultado = await NotificacionModel.findOneAndUpdate(
            {id },
            { estado: true },
            {new: true}
        );
        return resultado;

    }
}

module.exports = MongoNotificacionDataSource; // Exporta la clase
