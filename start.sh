#!/bin/bash
docker build -t boldo-web:latest -f Dockerfile-local .
docker run -p 3000:3000 boldo-web:latest
