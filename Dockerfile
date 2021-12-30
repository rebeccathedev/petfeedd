FROM alpine:3.15
COPY ./src/petfeedd-node/ /usr/src/app/
COPY ./src/petfeedd-vue /usr/src/petfeedd-vue
COPY ./package* /usr/src
COPY ./webpack.config.js /usr/src/webpack.config.js
COPY ./babel.config.js /usr/src/babel.config.js
WORKDIR /usr/src
RUN apk add --update nodejs-lts npm python3 make g++
RUN npm ci
RUN npx webpack
RUN rm -rf /usr/src/petfeedd-vue \
        /usr/src/webpack.config.js \
        /usr/src/babel.config.js \
    apk del python3 make g++
EXPOSE 8080
WORKDIR /usr/src/app
ENTRYPOINT [ "node", "index.js" ]
