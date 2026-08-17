from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os
import json

app = FastAPI()

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
app.mount("/static", StaticFiles(directory=PUBLIC_DIR), name="static")

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

@app.get("/api/hello")
async def api_hello():
    return {"message": "Hello from FastAPI API!"}

@app.get("/{path:path}")
async def spa_fallback(request: Request, path: str):
    if path.startswith("api") or path.startswith("static"):
        return {"error": "not found"}
    
    html_path = find_index_html()
    if not html_path:
        return HTMLResponse(content="Not Found", status_code=404)
    
    with open(html_path, 'r') as f:
        html = f.read()
    
    html = inject_state(html, None)
    
    return HTMLResponse(content=html, headers={'Cache-Control': 'no-store, no-cache, must-revalidate, private'})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)