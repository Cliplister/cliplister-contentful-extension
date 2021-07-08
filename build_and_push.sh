#!/usr/bin/env bash
docker build -t cldreg01.mycliplister.com/external/contentful:latest -f Dockerfile .
docker push cldreg01.mycliplister.com/external/contentful:latest
