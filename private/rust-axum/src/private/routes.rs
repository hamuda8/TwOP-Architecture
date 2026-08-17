use axum::Router;

pub fn routes() -> Router {
    Router::new().route("/api/hello", axum::routing::get(|| async { "Hello from Axum API!" }))
}