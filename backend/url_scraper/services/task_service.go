package services

import (
	"backend/url_scraper/crawler"
	"backend/url_scraper/models"
	"backend/url_scraper/repositories"
	"time"
)

/*
*
Contains business logic for interacting with tasks
*/
type TaskService interface {
	Start(id string) error
	Stop() error
	Create(task *models.Task) error
	GetByID(id string) (*models.Task, error)
	Search(search *models.TaskSearch) ([]*models.Task, error)
	Update(task *models.Task) error
	Delete(id string) error
	BulkDelete(ids []string) error
	BulkReRunTasks(ids []string) error
}

type TaskServiceImpl struct {
	taskRepo repositories.TaskRepository
	worker   *crawler.Worker
}

func NewTaskService(taskRepo repositories.TaskRepository, worker *crawler.Worker) TaskService {
	return &TaskServiceImpl{
		taskRepo: taskRepo,
		worker:   worker,
	}
}

func (s *TaskServiceImpl) getCurrentTask() ([]*models.Task, error) {
	search := &models.TaskSearch{
		Status:   models.StatusRunning,
		Page:     1,
		PageSize: 1,
	}
	return s.taskRepo.Search(search)
}
func (s *TaskServiceImpl) Start(id string) error {
	if err := s.Stop(); err != nil {
		return err
	}

	task, err := s.taskRepo.GetByID(id)
	if err != nil {
		return err
	}
	task.ResetResult()
	now := time.Now().Unix()
	task.RequestProcessingAt = &now
	return s.taskRepo.Update(task)
}

func (s *TaskServiceImpl) Stop() error {
	s.worker.Interrupt()
	currentTasks, err := s.getCurrentTask()
	if err != nil {
		return err
	}

	now := time.Now().Unix()
	for _, t := range currentTasks {
		t.ResetResult()
		t.RequestProcessingAt = &now
	}
	if err := s.taskRepo.BulkUpdate(currentTasks); err != nil {
		return err
	}
	return nil
}

func (s *TaskServiceImpl) Create(task *models.Task) error {
	return s.taskRepo.Create(task)
}

func (s *TaskServiceImpl) GetByID(id string) (*models.Task, error) {
	return s.taskRepo.GetByID(id)
}

func (s *TaskServiceImpl) Search(search *models.TaskSearch) ([]*models.Task, error) {
	return s.taskRepo.Search(search)
}

func (s *TaskServiceImpl) Update(task *models.Task) error {
	return s.taskRepo.Update(task)
}

func (s *TaskServiceImpl) Delete(id string) error {
	return s.taskRepo.Delete(id)
}

func (s *TaskServiceImpl) BulkDelete(ids []string) error {
	return s.taskRepo.BulkDelete(ids)
}

func (s *TaskServiceImpl) BulkUpdate(tasks []*models.Task) error {
	return s.taskRepo.BulkUpdate(tasks)
}

func (s *TaskServiceImpl) BulkReRunTasks(ids []string) error {
	tasks, err := s.taskRepo.Search(&models.TaskSearch{
		IDs: ids,
	})
	if err != nil {
		return err
	}
	now := time.Now().Unix()

	for _, task := range tasks {
		// skip tasks that are already running
		if task.Status == models.StatusRunning {
			continue
		}
		task.ResetResult()
		task.RequestProcessingAt = &now
	}
	return s.taskRepo.BulkUpdate(tasks)
}
