from config import app, db
from routes import auth_routes

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    # TODO: Remove the debug=True when finish the project
    app.run(debug=True)
