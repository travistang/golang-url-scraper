package main

import (
	"backend/url_scraper"
	"log"
	"os"
)

func migrateInaccessibleLinks() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not set")
	}
	dsn := os.Getenv("DATABASE_URL")
	db, err := url_scraper.ConnectDatabase(dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Step 1: Add the new JSON column
	err = db.Exec(`
        ALTER TABLE tasks 
        ADD COLUMN inaccessible_links_new JSON
    `).Error
	if err != nil {
		log.Fatal("Failed to add new column:", err)
	}

	// Step 2: Convert existing data
	// All existing records will get an empty array since we're not preserving the count
	err = db.Exec(`
        UPDATE tasks 
        SET inaccessible_links_new = JSON_ARRAY()
        WHERE inaccessible_links_new IS NULL
    `).Error
	if err != nil {
		log.Fatal("Failed to convert existing data:", err)
	}

	// Step 3: Drop the old column
	err = db.Exec(`
        ALTER TABLE tasks 
        DROP COLUMN inaccessible_links
    `).Error
	if err != nil {
		log.Fatal("Failed to drop old column:", err)
	}

	// Step 4: Rename the new column
	err = db.Exec(`
        ALTER TABLE tasks 
        CHANGE COLUMN inaccessible_links_new inaccessible_links JSON
    `).Error
	if err != nil {
		log.Fatal("Failed to rename column:", err)
	}

	log.Println("Migration completed successfully!")
}

func main() {
	migrateInaccessibleLinks()
}
