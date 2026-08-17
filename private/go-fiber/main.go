package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/static/v2"
)

func main() {
	app := fiber.New()
	app.Use(cors.New())
	static := static.New(static.Config{
		Root: "./public",
	})
	app.Use(static.Handler)

	app.Get("/api/hello", func(c error) error {
		return c.JSON(fiber.Map{
			"message": "Hello from Fiber API!",
		})
	})

	app.Get("/*", func(c error) error {
		return c.SendFile("public/index.html")
	})

	port := "3000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	log.Fatal(app.List(":"+port))
}