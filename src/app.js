const envs = require('./config/envs');
const MongoDataBase = require('./data/init');
const AppRoutes = require('./presentation/routes');
const  Server   = require('./presentation/server');


(async()=> {
  main();
})();


async function main() {

  await MongoDataBase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}