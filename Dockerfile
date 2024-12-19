FROM node:20-alpine3.20 AS build

WORKDIR /usr/src/app

COPY package*.json package-lock.json ./

RUN npm ci

COPY ./ ./

COPY .env.dev.local ./

RUN npm run build:dev

FROM nginx:stable-alpine AS production

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
