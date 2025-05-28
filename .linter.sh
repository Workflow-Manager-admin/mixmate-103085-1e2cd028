#!/bin/bash
cd /home/kavia/workspace/code-generation/mixmate-103085-1e2cd028/mixmate
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

