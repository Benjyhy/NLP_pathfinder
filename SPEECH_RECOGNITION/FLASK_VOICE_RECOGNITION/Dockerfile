FROM python:3.8

ENV PIP_ROOT_USER_ACTION=ignore

RUN mkdir recognition

COPY ./app /recognition/app

WORKDIR /recognition

RUN pip install --upgrade pip
RUN pip install -r app/requirements.txt 