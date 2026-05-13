from os import getenv
from flask import Flask, jsonify
from routes import api


def create_app():
    """
    Builds the Flask app that presents the routes to the gateway.

    Returns:
        app instance
    """

    app = Flask(__name__, instance_relative_config=True)
    api.init_app(app)

    @app.after_request
    def apply_cors(response):
        """Apply cors headers after each request"""
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add("Access-Control-Allow-Headers",
                             "Origin, X-Requested-With, Content-Type, Accept")
        response.headers.add('Access-Control-Allow-Methods',
                             'POST, GET, OPTIONS, PUT, DELETE')
        return response

    if getenv('FLASK_ENV') == 'development':
        @app.route('/userInfo', methods=['GET'])
        def dev_user_info():
            return jsonify({
                'id': 1,
                'name': 'Dev User',
                'role': 'ADMIN',
                'finance_permission': True,
                'column_config': None,
                'similarity_column_config': None
            })

    return app


if __name__ == '__main__':
    port = getenv('PORT') or 8002
    instance = create_app()
    instance.run(port=port, host="0.0.0.0")
