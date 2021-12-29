FROM node:lts
COPY ./src/petfeedd-node/ /usr/src/app/
COPY ./src/petfeedd-vue /usr/src/petfeedd-vue
COPY ./package* /usr/src
COPY ./webpack.config.js /usr/src/webpack.config.js
COPY ./babel.config.js /usr/src/babel.config.js
RUN cd /usr/src && \
    npm ci && \
    npx webpack && \
    rm -rf /usr/src/petfeedd-vue \
        /usr/src/webpack.config.js \
        /usr/src/babel.config.js
EXPOSE 8080
WORKDIR /usr/src/app
ENTRYPOINT [ "node", "index.js" ]
