package url_scraper

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func ConnectDatabase(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&Task{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
