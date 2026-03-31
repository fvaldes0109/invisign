FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libxcb1 \
    libglib2.0-0 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${APP_PORT:-8000}

CMD uvicorn server:app --reload --host ${WATERMARK_SERVICE_HOST:-0.0.0.0} --port ${WATERMARK_SERVICE_PORT:-8000}
