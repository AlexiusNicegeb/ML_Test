﻿FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends `
    build-essential git tzdata `
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["python", "src/main.py"]