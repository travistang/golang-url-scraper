package url_scraper

import (
	"backend/url_scraper/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDatabase(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&models.Task{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
