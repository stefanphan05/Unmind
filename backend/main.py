# main.py
import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

print("=" * 60)
print("MAIN.PY DEBUG")
print(f"Backend dir: {backend_dir}")
print(f"sys.path[0]: {sys.path[0]}")
print(f"Files in backend: {os.listdir(backend_dir)}")
print(f"Files in models: {os.listdir(os.path.join(backend_dir, 'models'))}")
print("=" * 60)

from config import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)