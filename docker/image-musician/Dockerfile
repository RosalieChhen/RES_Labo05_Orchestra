FROM node:12.16.3

RUN apt-get update && \
    apt-get install -y nano

COPY src /opt/app

ENTRYPOINT ["node", "/opt/app/index.js"]
CMD ["piano"]