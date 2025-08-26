FROM oven/bun:1
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
USER bun
CMD ["bun", "dist/index.js"]
