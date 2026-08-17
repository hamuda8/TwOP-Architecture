from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/api/hello")
async def api_hello():
    return {"message": "Hello from FastAPI API!"}

@app.get("/{path:path}")
async def spa_fallback(request):
    path = request.path
    if path.startswith("/api") or path.startswith("/static"):
        return {"error": "not found"}
    return FileResponse("public/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)