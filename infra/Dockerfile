# This is built assuming its from the root dir of the monorepo

FROM node:20
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

EXPOSE 4000

WORKDIR /app

# Copy all required files from the monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./packages ./packages
COPY ./apps/backend ./apps/backend

# RUN npm i -g pnpm
RUN pnpm install

WORKDIR /app/apps/backend

CMD ["pnpm", "start"]
