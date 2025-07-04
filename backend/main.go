package main

import (
	"log"
	"os"

	"backend/url_scraper"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not set")
	}

	db, err := url_scraper.ConnectDatabase(dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/health", Healthcheck)

	api := router.Group("/api/v1")
	taskHandler := url_scraper.NewTaskHandler(db)
	taskHandler.RegisterRoutes(api)

	log.Println("Starting server on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
