package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/static/v2"
)

func safeJSON(obj interface{}) string {
	if obj == nil {
		return "null"
	}
	b, _ := json.Marshal(obj)
	s := string(b)
	return strings.ReplaceAll(s, "</script>", "<\\/script>")
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
	publicDir := "./public"
	indexPath := filepath.Join(publicDir, "index.html")
	markupPath := filepath.Join(publicDir, "markup", "index.html")
	
	if _, err := os.Stat(indexPath); err == nil {
		return indexPath, nil
	}
	if _, err := os.Stat(markupPath); err == nil {
		return markupPath, nil
	}
	return "", os.ErrNotExist
}

func serveIndex(c *fiber.Ctx, state interface{}) error {
	htmlPath, err := findIndexHTML()
	if err != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}
	
	content, err := os.ReadFile(htmlPath)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	
	html := injectState(string(content), state)
	
	c.Set("Content-Type", "text/html")
	c.Set("Cache-Control", "no-store, no-cache, must-revalidate, private")
	return c.SendString(html)
}

func main() {
	app := fiber.New()
	app.Use(cors.New())
	static := static.New(static.Config{
		Root: "./public",
	})
	app.Use(static.Handler)

	app.Get("/api/hello", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Hello from Fiber API!",
		})
	})

	app.Get("/*", func(c *fiber.Ctx) error {
		if strings.HasPrefix(c.Path(), "/api") {
			return c.SendStatus(fiber.StatusNotFound)
		}
		return serveIndex(c, nil)
	})

	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	log.Fatal(app.Listen(":" + port))
}