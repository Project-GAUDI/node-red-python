#!/bin/bash

name="@project-gaudi\/node-red-python"
description="Node-RED-Python"
target="package.json"
author="Toyota Industries Corporation"
lisence="MIT"
version=${VERSION}
version='6.0.1'
url="https://github.com/Project-GAUDI/node-red-python"

sed -i 's/\"name\": \".*\",/\"name\": \"'"${name}"'\",/g' "${target}"
sed -i 's/\"version\": \".*\",/\"version\": \"'"${version}"'\",/g' "${target}"
sed -i 's/\"description\": \".*\",/\"description\": \"'"${description}"'\",/g' "${target}"
sed -i 's|"author": ".*",|"author": "'"${author}"'", |g' "${target}"
sed -i 's|"license": ".*"|"license": "'"${lisence}"'"|g' "${target}"

grep -q '"repository"' "${target}" || \
sed -i '/"node-red": {/i \
    "repository": { \
        "type": "git",\
        "url": "git+'"${url}"'" \
    },' "${target}"

grep -q '"bugs"' "${target}" || \
sed -i '/"node-red": {/i \
    "bugs": { \
        "url": "'"${url}"'/issues" \
    },' "${target}"

grep -q '"homepage"' "${target}" || \
sed -i '/"node-red": {/i \
    "homepage": "'"${url}"'#readme",' "${target}"