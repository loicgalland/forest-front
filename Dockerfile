FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run build

FROM node:18-slim AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./

RUN npm install --production

EXPOSE 3000

CMD ["npm",  "start"]
