# Use the latest Ubuntu base image
FROM ubuntu:25.04

# Install dependencies and BIND9
RUN apt-get update && \
    apt-get install -y bind9 && \
    rm -rf /var/lib/apt/lists/* 

# Copy the custom named.conf file and zone file to the container
COPY named.conf /etc/bind/named.conf
COPY db.test.local /etc/bind/db.test.local

RUN ls -l /etc/bind

# Expose the DNS port (53) for TCP and UDP
EXPOSE 53/tcp 53/udp

# Run BIND9 with the custom configuration file
CMD ["named", "-g"]

