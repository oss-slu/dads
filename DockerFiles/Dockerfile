FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB dynamSystems
COPY *.sql /docker-entrypoint-initdb.d/
ADD setup.sql /docker-entrypoint-initdb.d
RUN chmod a+r /docker-entrypoint-initdb.d/*
EXPOSE 6666