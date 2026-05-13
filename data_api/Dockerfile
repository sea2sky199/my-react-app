FROM python:3.6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY dev_requirements.txt ./
RUN pip install -r dev_requirements.txt

COPY . .

EXPOSE 8002

CMD [ "python", "app.py"]
