# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]