# Use the latest Ubuntu image as the base
FROM nikolaik/python-nodejs:latest

WORKDIR /app

COPY . /app

ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN /app/setup.sh

# Expose ports
EXPOSE 80

# Start script in the foreground
CMD ["bash", "/app/run.sh"]
