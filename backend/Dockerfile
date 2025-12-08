FROM python:3.11-slim

# Install system dependencies for pyttsx3 and audio processing
RUN apt-get update && apt-get install -y \
    espeak-ng \
    ffmpeg \
    libespeak1 \
    libsndfile1 \
    alsa-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for better Docker caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Set environment variables
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8000

# Use gunicorn to serve Flask app
# Increased timeout for TTS processing
CMD gunicorn main:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --worker-class sync