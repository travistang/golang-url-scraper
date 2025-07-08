package repositories

import (
	"backend/url_scraper/models"
	"strings"

	"gorm.io/gorm"
)

/*
*
* Contains database operations for tasks
 */
type TaskRepository interface {
	Create(task *models.Task) error
	GetByID(id string) (*models.Task, error)
	Search(search *models.TaskSearch) ([]*models.Task, error)
	Update(task *models.Task) error
	Delete(id string) error
	BulkDelete(ids []string) error
	BulkUpdate(tasks []*models.Task) error
}

type MySQLTaskRepository struct {
	db *gorm.DB
}

func NewMySQLTaskRepository(db *gorm.DB) TaskRepository {
	return &MySQLTaskRepository{db: db}
}

func (r *MySQLTaskRepository) Create(task *models.Task) error {
	return r.db.Create(task).Error
}

func (r *MySQLTaskRepository) GetByID(id string) (*models.Task, error) {
	var task models.Task
	err := r.db.Where("id = ?", id).First(&task).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *MySQLTaskRepository) Search(search *models.TaskSearch) ([]*models.Task, error) {
	var tasks []*models.Task

	query := r.db.Model(&models.Task{})

	query = r.applyFilters(query, search)
	query = r.applySorting(query, search)
	query = r.applyPagination(query, search)

	err := query.Find(&tasks).Error
	return tasks, err
}

func (r *MySQLTaskRepository) applyFilters(query *gorm.DB, search *models.TaskSearch) *gorm.DB {

	if len(search.IDs) > 0 {
		query = query.Where("id IN (?)", search.IDs)
	}

	if search.Status != "" {
		query = query.Where("status = ?", search.Status)
	}

	if search.URL != "" {
		query = query.Where("url LIKE ?", "%"+search.URL+"%")
	}

	if search.RequestProcessingAt != nil {
		query = query.Where("request_processing_at = ?", *search.RequestProcessingAt)
	}

	if search.SubmittedAfter != nil {
		query = query.Where("submitted_at >= ?", search.SubmittedAfter)
	}

	if search.SubmittedBefore != nil {
		query = query.Where("submitted_at <= ?", search.SubmittedBefore)
	}

	if search.HasResult != nil {
		if *search.HasResult {
			query = query.Where("started_at IS NOT NULL")
		} else {
			query = query.Where("started_at IS NULL")
		}
	}

	if search.PageTitle != "" {
		query = query.Where("page_title LIKE ?", "%"+search.PageTitle+"%")
	}

	if search.HTMLVersion != "" {
		query = query.Where("html_version LIKE ?", "%"+search.HTMLVersion+"%")
	}

	if search.HasLoginForm != nil {
		query = query.Where("has_login_form = ?", *search.HasLoginForm)
	}

	if search.MinInternalLinks != nil {
		query = query.Where("internal_links >= ?", *search.MinInternalLinks)
	}

	if search.MaxInternalLinks != nil {
		query = query.Where("internal_links <= ?", *search.MaxInternalLinks)
	}

	if search.MinExternalLinks != nil {
		query = query.Where("external_links >= ?", *search.MinExternalLinks)
	}

	if search.MaxExternalLinks != nil {
		query = query.Where("external_links <= ?", *search.MaxExternalLinks)
	}

	if search.MinH1Count != nil {
		query = query.Where("h1_count >= ?", *search.MinH1Count)
	}

	if search.MaxH1Count != nil {
		query = query.Where("h1_count <= ?", *search.MaxH1Count)
	}

	if search.MinH2Count != nil {
		query = query.Where("h2_count >= ?", *search.MinH2Count)
	}

	if search.MaxH2Count != nil {
		query = query.Where("h2_count <= ?", *search.MaxH2Count)
	}

	if search.MinH3Count != nil {
		query = query.Where("h3_count >= ?", *search.MinH3Count)
	}

	if search.MaxH3Count != nil {
		query = query.Where("h3_count <= ?", *search.MaxH3Count)
	}

	if search.MinH4Count != nil {
		query = query.Where("h4_count >= ?", *search.MinH4Count)
	}

	if search.MaxH4Count != nil {
		query = query.Where("h4_count <= ?", *search.MaxH4Count)
	}

	if search.MinH5Count != nil {
		query = query.Where("h5_count >= ?", *search.MinH5Count)
	}

	if search.MaxH5Count != nil {
		query = query.Where("h5_count <= ?", *search.MaxH5Count)
	}

	if search.MinH6Count != nil {
		query = query.Where("h6_count >= ?", *search.MinH6Count)
	}

	if search.MaxH6Count != nil {
		query = query.Where("h6_count <= ?", *search.MaxH6Count)
	}

	if search.GlobalSearch != "" {
		searchTerm := "%" + search.GlobalSearch + "%"
		query = query.Where("(url LIKE ? OR id LIKE ? OR page_title LIKE ? OR html_version LIKE ?)",
			searchTerm, searchTerm, searchTerm, searchTerm)
	}

	return query
}

func (r *MySQLTaskRepository) applySorting(query *gorm.DB, search *models.TaskSearch) *gorm.DB {
	sortBy := search.GetSortBy()
	sortOrder := search.GetSortOrder()

	// Map JSON property names (camelCase) to database column names (snake_case)
	columnMapping := map[string]string{
		"id":                  "id",
		"url":                 "url",
		"status":              "status",
		"submittedAt":         "submitted_at",
		"requestProcessingAt": "request_processing_at",
		"startedAt":           "started_at",
		"completedAt":         "completed_at",
		"pageTitle":           "page_title",
		"htmlVersion":         "html_version",
		"hasLoginForm":        "has_login_form",
		"h1Count":             "h1_count",
		"h2Count":             "h2_count",
		"h3Count":             "h3_count",
		"h4Count":             "h4_count",
		"h5Count":             "h5_count",
		"h6Count":             "h6_count",
		"internalLinks":       "internal_links",
		"externalLinks":       "external_links",
		"inaccessibleLinks":   "inaccessible_links",
	}

	// Get the database column name
	dbColumnName := columnMapping[sortBy]
	if dbColumnName == "" {
		// If mapping not found, default to submitted_at
		dbColumnName = "submitted_at"
	}

	orderClause := dbColumnName + " " + strings.ToUpper(sortOrder)
	return query.Order(orderClause)
}

func (r *MySQLTaskRepository) applyPagination(query *gorm.DB, search *models.TaskSearch) *gorm.DB {
	return query.Limit(search.GetLimit()).Offset(search.GetOffset())
}

func (r *MySQLTaskRepository) Update(task *models.Task) error {
	return r.db.Save(task).Error
}

func (r *MySQLTaskRepository) Delete(id string) error {
	result := r.db.Where("id = ?", id).Delete(&models.Task{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *MySQLTaskRepository) BulkDelete(ids []string) error {
	result := r.db.Where("id IN (?)", ids).Delete(&models.Task{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *MySQLTaskRepository) BulkUpdate(tasks []*models.Task) error {
	tx := r.db.Begin()
	for _, task := range tasks {
		if err := tx.Save(task).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
