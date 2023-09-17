# Use the latest Ubuntu image as the base
FROM nikolaik/python-nodejs:latest

WORKDIR /app

COPY . /app

ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE

RUN /app/setup.sh

# Expose ports
EXPOSE 8080

# Start script in the foreground
CMD ["/usr/bin/supervisord"]
