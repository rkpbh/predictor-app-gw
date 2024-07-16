FROM node:20.15.0-slim as builder
RUN npm install pnpm -g

WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build

FROM node:20.15.0-slim as base
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 8000
CMD ["node", "index.js"]