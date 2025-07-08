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
	ID                  string     `json:"id" gorm:"primaryKey"`
	URL                 string     `json:"url" gorm:"type:text"`
	Status              TaskStatus `json:"status" gorm:"type:enum('pending','running','completed','failed')"`
	SubmittedAt         time.Time  `json:"submittedAt" gorm:"type:timestamp;default:CURRENT_TIMESTAMP()"`
	RequestProcessingAt *int64     `json:"requestProcessingAt" gorm:"default:null"`

	StartedAt         *time.Time `json:"startedAt,omitempty"`
	CompletedAt       *time.Time `json:"completedAt,omitempty"`
	HTMLVersion       *string    `json:"htmlVersion,omitempty" gorm:"size:50"`
	PageTitle         *string    `json:"pageTitle,omitempty" gorm:"type:text"`
	HasLoginForm      *bool      `json:"hasLoginForm,omitempty" gorm:"default:null"`
	H1Count           *int       `json:"h1Count,omitempty" gorm:"default:null"`
	H2Count           *int       `json:"h2Count,omitempty" gorm:"default:null"`
	H3Count           *int       `json:"h3Count,omitempty" gorm:"default:null"`
	H4Count           *int       `json:"h4Count,omitempty" gorm:"default:null"`
	H5Count           *int       `json:"h5Count,omitempty" gorm:"default:null"`
	H6Count           *int       `json:"h6Count,omitempty" gorm:"default:null"`
	InternalLinks     *int       `json:"internalLinks,omitempty" gorm:"default:null"`
	ExternalLinks     *int       `json:"externalLinks,omitempty" gorm:"default:null"`
	InaccessibleLinks *int       `json:"inaccessibleLinks,omitempty" gorm:"default:null"`
}

func (Task) TableName() string {
	return "tasks"
}

func (t *Task) ResetResult() {
	t.HTMLVersion = nil
	t.PageTitle = nil
	t.HasLoginForm = nil
	t.H1Count = nil
	t.H2Count = nil
	t.H3Count = nil
	t.H4Count = nil
	t.H5Count = nil
	t.H6Count = nil
	t.InternalLinks = nil
	t.ExternalLinks = nil
	t.InaccessibleLinks = nil
	t.StartedAt = nil
	t.CompletedAt = nil
	t.Status = StatusPending
}

type TaskSearch struct {
	IDs       []string `form:"ids"`
	Page      int      `form:"page"`
	PageSize  int      `form:"pageSize"`
	SortBy    string   `form:"sortBy"`
	SortOrder string   `form:"sortOrder"`

	Status TaskStatus `form:"status"`
	URL    string     `form:"url"`

	SubmittedAfter  *time.Time `form:"submittedAfter"`
	SubmittedBefore *time.Time `form:"submittedBefore"`

	RequestProcessingAt *int64 `form:"requestProcessingAt"`

	GlobalSearch string `form:"globalSearch"`

	HasResult *bool `form:"hasResult"`

	PageTitle        string `form:"pageTitle"`
	HTMLVersion      string `form:"htmlVersion"`
	HasLoginForm     *bool  `form:"hasLoginForm"`
	MinInternalLinks *int   `form:"minInternalLinks"`
	MaxInternalLinks *int   `form:"maxInternalLinks"`
	MinExternalLinks *int   `form:"minExternalLinks"`
	MaxExternalLinks *int   `form:"maxExternalLinks"`
	MinH1Count       *int   `form:"minH1Count"`
	MaxH1Count       *int   `form:"maxH1Count"`
	MinH2Count       *int   `form:"minH2Count"`
	MaxH2Count       *int   `form:"maxH2Count"`
	MinH3Count       *int   `form:"minH3Count"`
	MaxH3Count       *int   `form:"maxH3Count"`
	MinH4Count       *int   `form:"minH4Count"`
	MaxH4Count       *int   `form:"maxH4Count"`
	MinH5Count       *int   `form:"minH5Count"`
	MaxH5Count       *int   `form:"maxH5Count"`
	MinH6Count       *int   `form:"minH6Count"`
	MaxH6Count       *int   `form:"maxH6Count"`
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
		return "submittedAt"
	}
	return ts.SortBy
}

func (ts *TaskSearch) GetSortOrder() string {
	if ts.SortOrder == "" || (ts.SortOrder != "asc" && ts.SortOrder != "desc") {
		return "desc"
	}
	return ts.SortOrder
}
