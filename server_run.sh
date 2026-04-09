#!/usr/bin/env bash
# Simple local server to serve the Trend Insight SPA
# Run this script from the NewTrand directory

# Change to the frontend folder where index.html lives
cd "$(dirname "$0")/frontend"

# Start a Python HTTP server on port 8000
python3 -m http.server 8000 --directory .

# When you stop the server (Ctrl+C), the script ends
