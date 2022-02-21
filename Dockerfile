FROM alpine:3.15
COPY ./src/ /usr/src/petfeedd/src/
COPY ./package* /usr/src/petfeedd
COPY ./*.config.js /usr/src/petfeedd
WORKDIR /usr/src/petfeedd
RUN apk add --update nodejs-lts npm python3 make g++ wget unzip && \
    wget https://github.com/joan2937/pigpio/archive/refs/tags/v79.zip && \
    unzip v79.zip && \
    cd pigpio-79 && \
    sed -i -e 's/ldconfig/echo ldconfig disabled/g' Makefile && \
    make && make install && \
    cd .. && \
    npm ci && \
    npx webpack && \
    mv output /usr/src/app && \
    mv node_modules /usr/src/app/ && \
    rm -rf /usr/src/petfeedd && \
    apk del python3 make g++
COPY ./docker/start.sh /usr/src/app/start.sh
EXPOSE 8080
WORKDIR /usr/src/app
ENTRYPOINT [ "/usr/src/app/start.sh" ]
