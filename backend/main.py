# main.py
import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from config import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)