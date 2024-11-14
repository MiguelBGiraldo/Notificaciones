const { request, response } = require("express");
const EmailService = require("../services/sendEmail");
const CheckService = require("../services/checkService");
const saveLog = require("../services/logs.service");


class controllerNotificacion {

    constructor(dataSource) {
        this.dataSource = dataSource; // Inyectar la fuente de datos en el constructor
        this.checkService = new CheckService(this.dataSource, () => console.log("El log se guardo"), () => console.log("Hubo un error en el log"));

        this.emailService = new EmailService();
    }

    guardarNotificacion = async (req = request, res = response) => {

        const { email, asunto, content, FromApp, FromFuntion } = req.body;


        const resCheck = await this.checkService.execute({ email, asunto, content, FromApp, FromFuntion });

        console.log(resCheck);

        if (!resCheck.ok) {

            //Se registra error. Hacerlo con rabbit.

            const log = {
                application: "Notificaciones",
                level: "high",
                className: "guardarNotificacion",
                summary: "Error al guardar notificacion",
                description: "No se pudo guardar la notificación. El error fue el siguiente: " + resCheck.error
            }
            saveLog(log);

            return res.status(500).json({
                error: true,
                mensaje: "No fue posible guardar la notificacion " + resCheck.error,
                code: 500
            });
        }

        const mailOptions = {
            to: email,
            from: process.env.MAILER_EMAIL,
            subject: 'Tienes una notificación',
            text: `
            Tienes una notificación con el siguiente contenido:\n
            "${content}"\n 
            Por favor revisa la notificación con detalle. 
            \n`,
        };


        try {

            this.emailService.sendEmail(mailOptions);

        } catch (error) {

            //Se registra el log. Hacerlo con rabbit

            const log = {
                application: "Notificaciones",
                level: "high",
                className: "guardarNotificacion",
                summary: "Error al enviar correo",
                description: "No se pudo enviar correo al usuario. El error fue el siguiente: " + error
            }
            saveLog(log);

        }

        return res.status(200).json({
            error: false,
            data: "Se guardo la notificación correctamente",
            code: 200

        });

    }

    getNotificacion = async (req = request, res = response) => {

        const { id } = req.params;

        try {

            const notficacion = await this.dataSource.getNotificacion(id);

            return res.status(200).json({
                error: false,
                data: notficacion,
                code: 200
            });
        } catch (error) {

            //Se registra el log

            const log = {
                application: "Notificaciones",
                level: "high",
                className: "getNotificacion",
                summary: "Error al obtener notificación",
                description: "No se pudo obtener la notificación, el error fue el siguiente: " + error
            }
            saveLog(log);

            console.log(log);
            console.log(error);

            return res.status(500).json({
                error: true,
                mensaje: error,
                code: 500
            });
        }

    }

    getNotificaciones = async (req = request, res = response) => {

        const { page = 1, limit = 10,startDate , endDate, ...resto } = req.query;
        try {

            const notifiaciones = await this.dataSource.getNotificaciones(page, limit,startDate,endDate, resto);

            return res.status(200).json({
                error: false,
                data: notifiaciones,
                code: 200
            });


        } catch (error) {

             //Se registra el log

             const log = {
                application: "Notificaciones",
                level: "high",
                className: "getNotificaciones",
                summary: "Error al obtener notificaciónes",
                description: "No se pudieron obtener las notificaciones, el error fue el siguiente: " + error
            }
            saveLog(log);

             return res.status(500).json({
                error: true,
                mensaje: error,
                code: 500
            });

        }

    }

    marcarComoLeida = async(req = request, res = response) => {

        const { id } = req.params;

        try {

            const resul = await this.dataSource.marcarNotificacionComoLeida(id);

            return res.status(200).json({
                error: false,
                data: resul,
                code: 200
            })

        } catch (error) {

            console.log(error);

            const log = {
                application: "Notificaciones",
                level: "high",
                className: "marcarComoLeida",
                summary: "Error al actualizar la notificación. ",
                description: "No se pudo marcar la notificación como leida, el error fue el siguiente: " + error
            }
            saveLog(log);

        }

            return res.status(500).json({
                error: true,
                mensaje: "No se pudo actualizar la notificación",
                code: 500
            });
        }
    }



module.exports = controllerNotificacion;