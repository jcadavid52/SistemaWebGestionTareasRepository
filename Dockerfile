# Etapa 1: Construir la app Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/gestion-tareas-web/browser /usr/share/nginx/html

# Exponer el puerto por el que se servirá la app
EXPOSE 80

# Comando por defecto para Nginx
CMD ["nginx", "-g", "daemon off;"]