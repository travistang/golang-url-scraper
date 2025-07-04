package url_scraper

import (
	"net/http"
	"time"

	"backend/url_scraper/models"
	"backend/url_scraper/repositories"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaskHandler struct {
	taskRepo repositories.TaskRepository
}

func NewTaskHandler(db *gorm.DB) *TaskHandler {
	return &TaskHandler{
		taskRepo: repositories.NewMySQLTaskRepository(db),
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

	task := models.Task{
		ID:          uuid.New().String(),
		URL:         req.URL,
		Status:      models.StatusPending,
		SubmittedAt: time.Now(),
	}

	if err := h.taskRepo.Create(&task); err != nil {
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

	task, err := h.taskRepo.GetByID(id)
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

	tasks, err := h.taskRepo.Search(&search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search tasks"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tasks":     tasks,
		"page":      search.Page,
		"page_size": search.GetLimit(),
		"total":     len(tasks),
	})
}

func (h *TaskHandler) UpdateTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}

	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.ID = id

	if err := h.taskRepo.Update(&task); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task ID is required"})
		return
	}

	if err := h.taskRepo.Delete(id); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func (h *TaskHandler) RegisterRoutes(api *gin.RouterGroup) {
	tasks := api.Group("/tasks")
	{
		tasks.POST("", h.CreateTask)
		tasks.GET("", h.SearchTasks)
		tasks.GET("/:id", h.GetTask)
		tasks.PUT("/:id", h.UpdateTask)
		tasks.DELETE("/:id", h.DeleteTask)
	}
}
