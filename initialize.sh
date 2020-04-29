#!/bin/bash

# Deploy factory contract
FACTORY_ADDRESS=`npx oz deploy -n development EndaomentFactory -k regular --no-interactive` && \
echo "$FACTORY_ADDRESS"