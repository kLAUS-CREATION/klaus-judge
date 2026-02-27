#!/bin/bash

# Ensure Redis and Postgres are running
# Ensure Docker images are built

echo "Checking if C++ Docker image exists..."
if [[ "$(docker images -q klaus-judge-cpp:latest 2> /dev/null)" == "" ]]; then
  echo "Building C++ Docker image..."
  cd docker-images/cpp && docker build -t klaus-judge-cpp:latest . && cd -
fi

echo "Checking if Python Docker image exists..."
if [[ "$(docker images -q klaus-judge-python:latest 2> /dev/null)" == "" ]]; then
  echo "Building Python Docker image..."
  cd docker-images/python && docker build -t klaus-judge-python:latest . && cd -
fi

echo "Starting Worker..."
cargo run
