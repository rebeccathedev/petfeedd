FROM arm32v6/python:3.7-alpine
COPY ./src /petfeedd/src
COPY ./Pipfile* /petfeedd/
WORKDIR /petfeedd
RUN apk add --update --no-cache g++ gcc libxslt-dev && pip3 install pipenv && pipenv install
EXPOSE 8080 11211
ENTRYPOINT ["/usr/local/bin/pipenv", "run", "python3", "/petfeedd/src/__main__.py"]
