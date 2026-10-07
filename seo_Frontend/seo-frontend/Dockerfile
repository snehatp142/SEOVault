# Stage 1: Build Angular application
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve Angular application
FROM nginx:alpine

COPY --from=build /app/dist/seo-frontend/browser /usr/share/nginx/html
COPY src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]