#  frontend (Vite + React + TS)
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY aquasentinel-frontend/ .
RUN npm install
RUN npm run build

# Backend(Node + TS + Express)
FROM node:18
WORKDIR /app
COPY Backend/ ./Backend
COPY --from=frontend /app/frontend/dist ./Backend/public
WORKDIR /app/Backend
RUN npm install

EXPOSE 5000
CMD ["npm", "start"]
