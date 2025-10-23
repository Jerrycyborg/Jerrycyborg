FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps
RUN corepack enable pnpm && pnpm install
ARG WORKSPACE
WORKDIR /app/${WORKSPACE}
CMD ["pnpm", "dev"]
