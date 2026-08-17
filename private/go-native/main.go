package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	fmt.Printf("Server running on http://localhost:%s\n", port)
	http.ListenAndServe(":"+port, routes())
}

func safeJSON(obj interface{}) template.JS {
	if obj == nil {
		return "null"
	}
	b, _ := json.Marshal(obj)
	s := string(b)
	s = strings.ReplaceAll(s, "</script>", "<\\/script>")
	return template.JS(s)
}

func injectState(html string, state interface{}) string {
	if state == nil {
		return html
	}
	stateScript := fmt.Sprintf("<script>window.__STATE__ = %s;</script>\n", safeJSON(state))
	if idx := strings.Index(html, "</head>"); idx != -1 {
		return html[:idx] + stateScript + html[idx:]
	}
	return stateScript + html
}

func findIndexHTML() (string, error) {
	publicDir := "public"
	indexPath := filepath.Join(publicDir, "index.html")
	markupPath := filepath.Join(publicDir, "markup", "index.html")
	
	if _, err := os.Stat(indexPath); err == nil {
		return indexPath, nil
	}
	if _, err := os.Stat(markupPath); err == nil {
		return markupPath, nil
	}
	return "", fs.ErrNotExist
}

func serveIndex(w http.ResponseWriter, state interface{}) {
	htmlPath, err := findIndexHTML()
	if err != nil {
		http.NotFound(w, nil)
		return
	}
	
	content, err := os.ReadFile(htmlPath)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	
	html := injectState(string(content), state)
	
	w.Header().Set("Content-Type", "text/html")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, private")
	w.Write([]byte(html))
}

func routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"Hello from Go Native API!"}`))
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api") {
			http.NotFound(w, nil)
			return
		}
		serveIndex(w, nil)
	})

	return mux
}