FROM node:slim
WORKDIR /usr/src/app
ENV MONGO_URL='mongodb+srv://minigame:75QqfBKmp19v8VO2@cluster0.tuexl.mongodb.net/tokenWhiteList?retryWrites=true&w=majority'
ENV PORT=1605
ENV MONGO_USERNAME='minigame'
ENV MONGO_PASSWORD='75QqfBKmp19v8VO2'
ENV MONGO_COLLECTION='tokenWhiteList'
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 1605
CMD [ "yarn", "start"]