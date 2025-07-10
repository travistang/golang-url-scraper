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
	Search(search *models.TaskSearch) (*repositories.TaskSearchResult, error)
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
	searchResult, err := s.taskRepo.Search(search)
	if err != nil {
		return nil, err
	}
	return searchResult.Tasks, nil
}

func (s *TaskServiceImpl) Start(id string) error {
	if s.worker.HasCurrentTask() {
		s.worker.Interrupt()
		defer s.worker.Resume()
	}

	task, err := s.taskRepo.GetByID(id)
	if err != nil {
		return err
	}
	task.ResetResult()
	zero := int64(0)
	task.RequestProcessingAt = &zero
	if err := s.taskRepo.Update(task); err != nil {
		return err
	}
	return nil
}

func (s *TaskServiceImpl) Stop() error {
	if !s.worker.HasCurrentTask() {
		return nil
	}

	s.worker.Interrupt()
	defer s.worker.Resume()

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

func (s *TaskServiceImpl) Search(search *models.TaskSearch) (*repositories.TaskSearchResult, error) {
	result, err := s.taskRepo.Search(search)
	if err != nil {
		return nil, err
	}
	return result, nil
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
	searchResult, err := s.taskRepo.Search(&models.TaskSearch{
		IDs: ids,
	})
	if err != nil {
		return err
	}
	now := time.Now().Unix()

	for _, task := range searchResult.Tasks {
		// skip tasks that are already running
		if task.Status == models.StatusRunning {
			continue
		}
		task.ResetResult()
		task.RequestProcessingAt = &now
	}
	return s.taskRepo.BulkUpdate(searchResult.Tasks)
}
