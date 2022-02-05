FROM alpine:3.15
COPY ./src/ /usr/src/petfeedd/src/
COPY ./package* /usr/src/petfeedd
COPY ./*.config.js /usr/src/petfeedd
WORKDIR /usr/src/petfeedd
RUN apk add --update nodejs-lts npm python3 make g++ && \
    npm ci && \
    npx webpack && \
    mv output /usr/src/app && \
    mv node_modules /usr/src/app/ && \
    rm -rf /usr/src/petfeedd && \
    apk del python3 make g++
EXPOSE 8080
WORKDIR /usr/src/app
ENTRYPOINT [ "node", "index.js" ]
