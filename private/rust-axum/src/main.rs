use axum::{routing::get, Router};
use tower_http::services::ServeDir;
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new();

    app.route("/api/hello", get(|| async { "Hello from Axum API!" }));

    app.route("/*", get(|| async {
        ServeDir::new("public").fallback("index.html")
    }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    axum::serve(axum::Listener::bind(addr).unwrap(), app).await.unwrap();
}