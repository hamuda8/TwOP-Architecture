from flask import Flask, send_from_directory, jsonify

app = Flask(__name__)

@app.route('/api/hello')
def api_hello():
    return jsonify({"message": "Hello from Flask API!"})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    from flask import abort
    if path.startswith('api'):
        abort(404)
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)