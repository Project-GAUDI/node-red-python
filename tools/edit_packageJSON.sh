#!/bin/bash

# name="node-red-python"
version="$1"
# description="Based on xxxxx"  #流用時
description="Node-RED-Python" #新規作成時
target="package.json"

# sed -i 's/\"name\": \".*\",/\"name\": \"'"${name}"'\",/g' "${target}"
sed -i 's/\"version\": \".*\",/\"version\": \"'"${version}"'\",/g' "${target}"
sed -i 's/\"description\": \".*\",/\"description\": \"'"${description}"'\",/g' "${target}"
