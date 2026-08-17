package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	fmt.Printf("Server running on http://localhost:%s\n", port)
	http.ListenAndServe(":"+port, routes())
}

func routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"Hello from Go Native API!"}`))
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "public/index.html")
	})

	return mux
}