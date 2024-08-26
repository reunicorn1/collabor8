#!/usr/bin/env bash
# script that will run on server by another util script called `runon.sh`
cd /home/ubuntu/collabor8/socket_server && \
git pull origin main && \
npm install
