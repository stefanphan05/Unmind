import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mailman import Mail

mail = Mail()


# Load environment variables from .env file
load_dotenv()

# Creates a flask app instance
app = Flask(__name__)
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT"))
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail.init_app(app)

# Enables cors
CORS(app)

# Configures database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///unmind.db"

# Disables modification tracking
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Set up secret key
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db = SQLAlchemy(app)
