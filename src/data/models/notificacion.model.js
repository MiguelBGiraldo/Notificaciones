const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid')

const notificacionSchema = new mongoose.Schema({

    id: {
        type: String,
        default: uuidv4,
        unique: true // Asegura que sea único en la colección
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },

    asunto: {

        type: String,
        required: [true, 'Asunto is required'],
    },
    content: {
        type: String,
    },

    FromApp: {
        type: String,
    },

    FromFuntion: {
        type: String,
    },

    estado: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now // Cambié new Date() por Date.now para obtener la fecha actual
    },
});

notificacionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});

const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);

module.exports = NotificacionModel;
