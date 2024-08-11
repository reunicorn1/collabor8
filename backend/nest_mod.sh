#!/usr/bin/env bash
# generate nest module, controller, provider/serivce

echo "wt's ur module name"
read -rp '➡️  '
nest g module "$REPLY"
nest g service "$REPLY"
nest g controller "$REPLY"
