const mongoose = require("mongoose");

class MongoDataBase {
    static async connect(options) {
        const { mongoUrl, dbName } = options;

        try {
            // Solo pasa dbName como parte de las opciones de conexión
            await mongoose.connect(mongoUrl, { dbName });

            console.log('MongoDB connected');
        } catch (error) {
            console.log('MongoDB connection error');
            throw error;
        }
    }
}

// Exportar la clase para su uso en otros archivos
module.exports = MongoDataBase;