FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci && chmod +x node_modules/.bin/*

COPY . .

ARG VITE_APPOINTMENT_URL
ENV VITE_APPOINTMENT_URL=$VITE_APPOINTMENT_URL
ARG VITE_GATEWAY_URL
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL
ARG VITE_MEDICAL_RECORD_URL
ENV VITE_MEDICAL_RECORD_URL=$VITE_MEDICAL_RECORD_URL
ARG VITE_PHARMACY_URL
ENV VITE_PHARMACY_URL=$VITE_PHARMACY_URL

RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
