FROM node:14-alpine AS ts-builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY mocks .
COPY .cache .
COPY src .
RUN yarn install
RUN yarn build

FROM node:14-alpine AS prod-runtime
WORKDIR /app
COPY --from=ts-builder ./app/dist ./dist
COPY package.json ./
COPY yarn.lock .
RUN yarn install --production
EXPOSE 3000
CMD [yarn, start]