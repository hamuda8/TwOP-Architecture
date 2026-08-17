use axum::{
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use serde_json;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use tower_http::services::{ServeDir, ServeFile};

fn safe_json(obj: &serde_json::Value) -> String {
    let mut s = serde_json::to_string(obj).unwrap_or_else(|_| "null".to_string());
    s = s.replace("</script>", "<\\/script>");
    s
}

fn inject_state(html: &str, state: Option<&serde_json::Value>) -> String {
    let Some(state) = state else {
        return html.to_string();
    };
    let state_script = format!("<script>window.__STATE__ = {};</script>\n", safe_json(state));
    if let Some(idx) = html.find("</head>") {
        let mut result = String::with_capacity(html.len() + state_script.len());
        result.push_str(&html[..idx]);
        result.push_str(&state_script);
        result.push_str(&html[idx..]);
        return result;
    }
    state_script + html
}

fn find_index_html() -> Option<PathBuf> {
    let public_dir = Path::new("public");
    let index_path = public_dir.join("index.html");
    let markup_path = public_dir.join("markup").join("index.html");
    
    if index_path.exists() {
        Some(index_path)
    } else if markup_path.exists() {
        Some(markup_path)
    } else {
        None
    }
}

async fn serve_index(state: Option<&serde_json::Value>) -> Response {
    let Some(html_path) = find_index_html() else {
        return (StatusCode::NOT_FOUND, "Not Found").into_response();
    };
    
    let content = match tokio::fs::read_to_string(&html_path).await {
        Ok(c) => c,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response(),
    };
    
    let html = inject_state(&content, state);
    
    Html(html)
        .with_header("Cache-Control", "no-store, no-cache, must-revalidate, private")
        .into_response()
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/hello", get(|| async { "Hello from Axum API!" }))
        .route("/*path", get(|path: String| async move {
            if path.starts_with("api") {
                return (StatusCode::NOT_FOUND, "Not Found").into_response();
            }
            serve_index(None).await
        }))
        .fallback_service(ServeDir::new("public").not_found_service(ServeFile::new("public/index.html")));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}