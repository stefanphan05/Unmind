from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create a flask app instance
app = Flask(__name__)

# Enables cors
CORS(app)

# Configure database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///unmind.db"

# Disable modification tracking
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
