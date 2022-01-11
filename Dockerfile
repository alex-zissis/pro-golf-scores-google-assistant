FROM node:16-alpine AS ts-builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY mocks ./mocks
COPY src ./src
COPY jest.config.js .
RUN yarn install
RUN yarn build

FROM ts-builder AS test
WORKDIR /app
RUN ["yarn", "test"]

FROM node:16-alpine AS prod-runtime
WORKDIR /app
ENV SPORTRADAR_API_KEY a
COPY --from=ts-builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
EXPOSE 3000
ENTRYPOINT ["yarn", "start:prod"]