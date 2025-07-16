from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Load environment variables from .env file
load_dotenv()

# Creates a flask app instance
app = Flask(__name__)

# Enables cors
CORS(app)

# Configures database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///unmind.db"

# Disables modification tracking
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Set up secret key
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db = SQLAlchemy(app)
