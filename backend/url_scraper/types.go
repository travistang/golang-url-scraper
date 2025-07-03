package url_scraper

import (
	"time"
)

type TaskStatus string

const (
	StatusPending   TaskStatus = "pending"
	StatusRunning   TaskStatus = "running"
	StatusCompleted TaskStatus = "completed"
	StatusFailed    TaskStatus = "failed"
)

type Task struct {
	ID          string     `json:"id"`
	URL         string     `json:"url"`
	Status      TaskStatus `json:"status"`
	SubmittedAt time.Time  `json:"submitted_at"`
}

type ScrapeResult struct {
	TaskID            string    `json:"task_id"`
	StartedAt         time.Time `json:"started_at"`
	CompletedAt       time.Time `json:"completed_at"`
	HTMLVersion       string    `json:"html_version"`
	PageTitle         string    `json:"page_title"`
	HasLoginForm      bool      `json:"has_login_form"`
	H1Count           int       `json:"h1_count"`
	H2Count           int       `json:"h2_count"`
	H3Count           int       `json:"h3_count"`
	H4Count           int       `json:"h4_count"`
	H5Count           int       `json:"h5_count"`
	H6Count           int       `json:"h6_count"`
	InternalLinks     int       `json:"internal_links"`
	ExternalLinks     int       `json:"external_links"`
	InaccessibleLinks int       `json:"inaccessible_links"`
}
