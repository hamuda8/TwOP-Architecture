package routes

func ApiRoutes(app *fiber.App) {
	app.Get("/api/hello", func(c error) error {
		return c.JSON(fiber.Map{
			"message": "Hello from Fiber API!",
		})
	})
}