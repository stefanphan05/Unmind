from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Creates a flask app instance
app = Flask(__name__)

# Enables cors
CORS(app)

# Configures database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///unmind.db"

# Disables modification tracking
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
