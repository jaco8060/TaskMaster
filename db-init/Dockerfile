# Use PostgreSQL 14 as the base image
FROM postgres:14

# Update package lists and install build dependencies for pg_cron
RUN apt-get update && apt-get install -y git make gcc postgresql-server-dev-14

# Clone pg_cron repository from CitusData into /pg_cron directory
RUN git clone https://github.com/citusdata/pg_cron.git /pg_cron

# Set working directory to the cloned pg_cron repository
WORKDIR /pg_cron

# Compile and install pg_cron extension using GCC compiler
RUN make CC=gcc && make install