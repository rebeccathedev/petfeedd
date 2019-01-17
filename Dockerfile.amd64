FROM python:3.7-stretch
COPY ./src /petfeedd/src
COPY ./Pipfile* /petfeedd/
WORKDIR /petfeedd
RUN pip3 install pipenv && pipenv install
EXPOSE 8080 11211
ENTRYPOINT ["/usr/local/bin/pipenv", "run", "python3", "/petfeedd/src/__main__.py"]
