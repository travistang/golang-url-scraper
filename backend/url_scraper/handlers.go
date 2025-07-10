package url_scraper

import (
	"net/http"
	"net/url"
	"time"

	"backend/url_scraper/crawler"
	"backend/url_scraper/models"
	"backend/url_scraper/repositories"
	"backend/url_scraper/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

/*
*
Contains HTTP handlers for tasks
*/
type TaskHandler struct {
	taskService services.TaskService
}

func NewTaskHandler(db *gorm.DB, worker *crawler.Worker) *TaskHandler {
	return &TaskHandler{
		taskService: services.NewTaskService(
			repositories.NewMySQLTaskRepository(db),
			worker,
		),
	}
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	var req struct {
		URL string `json:"url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := url.ParseRequestURI(req.URL); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL"})
		return
	}

	now := time.Now()
	submissionTime := now.Unix()

	task := models.Task{
		ID:                  uuid.New().String(),
		URL:                 req.URL,
		Status:              models.StatusPending,
		SubmittedAt:         now,
		RequestProcessingAt: &submissionTime,
	}

	if err := h.taskService.Create(&task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) GetTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}

	task, err := h.taskService.GetByID(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) SearchTasks(c *gin.Context) {
	var search models.TaskSearch

	if err := c.ShouldBindQuery(&search); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	searchResult, err := h.taskService.Search(&search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search tasks"})
		return
	}

	c.JSON(http.StatusOK, searchResult)
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}

	if err := h.taskService.Delete(id); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *TaskHandler) BulkDeleteTasks(c *gin.Context) {
	var req struct {
		IDs []string `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "IDs are required"})
		return
	}

	if err := h.taskService.BulkDelete(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to bulk delete tasks"})
		return
	}

	c.Status(http.StatusNoContent)
}

/**
* @api {post} /tasks/:id/start Start a task.
* @apiName StartTask
* @apiGroup Tasks
* @apiDescription Start a task regardless of its status. If the task is running, then this does nothing. Otherwise the current running task is interrupted and the scraper will work on this task instead.
* @apiParam {string} id The ID of the task to start
* @apiSuccess {string} message The message indicating the task has been started
 */
func (h *TaskHandler) StartTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}
	if err := h.taskService.Start(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start requested task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task started"})
}

/**
* @api {post} /tasks/:id/stop Stop a task.
* @apiName StopTask
* @apiGroup Tasks
* @apiDescription Stop a task regardless of its status. If the task is not running or pending, then this does nothing. Otherwise the task is marked as pending and the scraper will stop working on it. It will also be put at the end of the queue by setting request_processing_at to the current timestamp.
* @apiParam {string} id The ID of the task to stop
* @apiSuccess {string} message The message indicating the task has been stopped
 */
func (h *TaskHandler) StopTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}

	if err := h.taskService.Stop(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stop current task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task stopped"})
}

func (h *TaskHandler) BulkReRunTasks(c *gin.Context) {
	var req struct {
		IDs []string `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.taskService.BulkReRunTasks(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to bulk re-run tasks"})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *TaskHandler) RegisterRoutes(api *gin.RouterGroup) {
	tasks := api.Group("/tasks")
	{
		tasks.POST("", h.CreateTask)
		tasks.GET("", h.SearchTasks)
		tasks.DELETE("", h.BulkDeleteTasks)
		tasks.POST("/rerun", h.BulkReRunTasks)

		tasks.GET("/:id", h.GetTask)
		tasks.DELETE("/:id", h.DeleteTask)
		tasks.POST("/:id/start", h.StartTask)
		tasks.POST("/:id/stop", h.StopTask)
	}
}
