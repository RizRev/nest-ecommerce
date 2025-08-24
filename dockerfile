# Dev image: jalankan Nest pakai start:dev di dalam container
FROM node:22-alpine

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy manifest lebih dulu untuk caching layer
COPY package.json pnpm-lock.yaml ./
# Install termasuk devDependencies (butuh untuk start:dev)
RUN pnpm install --frozen-lockfile

# Copy seluruh source (TS)
COPY . .

# Env dev
ENV NODE_ENV=development

# Port default Nest
EXPOSE 3000

# Jalankan Nest dev mode (compiler/ts-node di dalam image)
CMD ["npm", "run", "start:dev"]
