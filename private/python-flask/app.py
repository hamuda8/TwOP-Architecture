from flask import Flask, send_from_directory, jsonify, abort
import os
import json
import re

app = Flask(__name__)

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')

def safe_json(obj):
    if obj is None:
        return 'null'
    return json.dumps(obj).replace('</script>', '<\\/script>')

def inject_state(html, state):
    if state is None:
        return html
    state_script = f'<script>window.__STATE__ = {safe_json(state)};</script>\n'
    if '</head>' in html:
        return html.replace('</head>', f'{state_script}</head>')
    return state_script + html

def find_index_html():
    index_path = os.path.join(PUBLIC_DIR, 'index.html')
    markup_path = os.path.join(PUBLIC_DIR, 'markup', 'index.html')
    
    if os.path.exists(index_path):
        return index_path
    elif os.path.exists(markup_path):
        return markup_path
    return None

@app.route('/api/hello')
def api_hello():
    return jsonify({"message": "Hello from Flask API!"})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api'):
        abort(404)
    
    html_path = find_index_html()
    if not html_path:
        abort(404)
    
    with open(html_path, 'r') as f:
        html = f.read()
    
    html = inject_state(html, None)
    
    response = app.response_class(html, mimetype='text/html')
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)