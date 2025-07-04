package models

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
	ID          string     `json:"id" gorm:"primaryKey"`
	URL         string     `json:"url" gorm:"type:text"`
	Status      TaskStatus `json:"status" gorm:"type:enum('pending','running','completed','failed')"`
	SubmittedAt time.Time  `json:"submitted_at" gorm:"type:timestamp;default:CURRENT_TIMESTAMP"`

	StartedAt         *time.Time `json:"started_at,omitempty"`
	CompletedAt       *time.Time `json:"completed_at,omitempty"`
	HTMLVersion       *string    `json:"html_version,omitempty" gorm:"size:50"`
	PageTitle         *string    `json:"page_title,omitempty" gorm:"type:text"`
	HasLoginForm      *bool      `json:"has_login_form,omitempty" gorm:"default:null"`
	H1Count           *int       `json:"h1_count,omitempty" gorm:"default:null"`
	H2Count           *int       `json:"h2_count,omitempty" gorm:"default:null"`
	H3Count           *int       `json:"h3_count,omitempty" gorm:"default:null"`
	H4Count           *int       `json:"h4_count,omitempty" gorm:"default:null"`
	H5Count           *int       `json:"h5_count,omitempty" gorm:"default:null"`
	H6Count           *int       `json:"h6_count,omitempty" gorm:"default:null"`
	InternalLinks     *int       `json:"internal_links,omitempty" gorm:"default:null"`
	ExternalLinks     *int       `json:"external_links,omitempty" gorm:"default:null"`
	InaccessibleLinks *int       `json:"inaccessible_links,omitempty" gorm:"default:null"`
}

func (Task) TableName() string {
	return "tasks"
}

type TaskSearch struct {
	Page      int    `json:"page"`
	PageSize  int    `json:"page_size"`
	SortBy    string `json:"sort_by"`
	SortOrder string `json:"sort_order"`

	Status TaskStatus `json:"status"`
	URL    string     `json:"url"`

	SubmittedAfter  *time.Time `json:"submitted_after"`
	SubmittedBefore *time.Time `json:"submitted_before"`

	GlobalSearch string `json:"global_search"`

	HasResult *bool `json:"has_result"`

	PageTitle        string `json:"page_title"`
	HTMLVersion      string `json:"html_version"`
	HasLoginForm     *bool  `json:"has_login_form"`
	MinInternalLinks *int   `json:"min_internal_links"`
	MaxInternalLinks *int   `json:"max_internal_links"`
	MinExternalLinks *int   `json:"min_external_links"`
	MaxExternalLinks *int   `json:"max_external_links"`
	MinH1Count       *int   `json:"min_h1_count"`
	MaxH1Count       *int   `json:"max_h1_count"`
	MinH2Count       *int   `json:"min_h2_count"`
	MaxH2Count       *int   `json:"max_h2_count"`
	MinH3Count       *int   `json:"min_h3_count"`
	MaxH3Count       *int   `json:"max_h3_count"`
	MinH4Count       *int   `json:"min_h4_count"`
	MaxH4Count       *int   `json:"max_h4_count"`
	MinH5Count       *int   `json:"min_h5_count"`
	MaxH5Count       *int   `json:"max_h5_count"`
	MinH6Count       *int   `json:"min_h6_count"`
	MaxH6Count       *int   `json:"max_h6_count"`
}

func (ts *TaskSearch) GetLimit() int {
	if ts.PageSize <= 0 {
		return 20
	}
	if ts.PageSize > 100 {
		return 100
	}
	return ts.PageSize
}

func (ts *TaskSearch) GetOffset() int {
	if ts.Page <= 0 {
		return 0
	}
	return (ts.Page - 1) * ts.GetLimit()
}

func (ts *TaskSearch) GetSortBy() string {
	if ts.SortBy == "" {
		return "submitted_at"
	}
	return ts.SortBy
}

func (ts *TaskSearch) GetSortOrder() string {
	if ts.SortOrder == "" || (ts.SortOrder != "asc" && ts.SortOrder != "desc") {
		return "desc"
	}
	return ts.SortOrder
}
