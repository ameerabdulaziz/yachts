#!/usr/bin/env python3
"""
Python Backend Workflow for Nauttec
Runs the Python API server on port 8000
"""
import subprocess
import os
import sys

def main():
    print("Starting Nauttec Python Backend Workflow...")
    os.chdir("django_backend")
    os.environ["PORT"] = "8000"
    
    try:
        subprocess.run([sys.executable, "nauttec_python_api.py"])
    except KeyboardInterrupt:
        print("\nBackend stopped by user")

if __name__ == "__main__":
    main()