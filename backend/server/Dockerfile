FROM node:20

EXPOSE 4000

COPY package.json pnpm-lock.yaml tsconfig.json app/
COPY src/ app/src/

WORKDIR /app

RUN npm i -g pnpm
RUN pnpm install

CMD ["pnpm", "start"]
