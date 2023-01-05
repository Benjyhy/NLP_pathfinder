FROM python:3.8

ENV PIP_ROOT_USER_ACTION=ignore

RUN mkdir recognition

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

COPY ./app /recognition/app
COPY ./.env /recognition/app

WORKDIR /recognition

RUN pip install --upgrade pip
RUN pip install -r app/requirements.txt 