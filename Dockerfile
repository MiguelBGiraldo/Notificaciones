# Usamos una imagen base específica de Node.js (18.14.1)
FROM node:18.14.1

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y el package-lock.json
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto de la aplicación
COPY . .


EXPOSE 8081

CMD ["npm", "run", "dev"]