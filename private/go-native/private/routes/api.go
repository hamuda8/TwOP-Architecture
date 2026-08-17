package routes

import "net/http"

func ApiRoutes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"Hello from Go Native API!"}`))
	})
	return mux
}