package crawler

import (
	"backend/url_scraper/models"
	"backend/url_scraper/repositories"
	"log"
	"time"
)

type Worker struct {
	repo    repositories.TaskRepository
	scraper *Scraper
	quit    chan bool
}

func NewWorker(repo repositories.TaskRepository) *Worker {
	return &Worker{
		repo:    repo,
		scraper: NewScraper(),
		quit:    make(chan bool),
	}
}

func (w *Worker) Start() {
	log.Println("Starting crawler worker...")

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			w.processNextTask()
		case <-w.quit:
			log.Println("Stopping crawler worker...")
			return
		}
	}
}

func (w *Worker) Stop() {
	w.quit <- true
}

func (w *Worker) processNextTask() {
	task, err := w.getNextPendingTask()
	if err != nil {
		return
	}

	if task == nil {
		return
	}

	log.Printf("Processing task %s for URL: %s", task.ID, task.URL)

	if err := w.markTaskAsRunning(task); err != nil {
		log.Printf("Failed to mark task %s as running: %v", task.ID, err)
		return
	}

	result, err := w.scraper.ScrapeURL(task.URL)
	if err != nil {
		log.Printf("Failed to scrape URL %s: %v", task.URL, err)
		w.markTaskAsFailed(task)
		return
	}

	w.scraper.UpdateTaskWithResults(task, result)
	w.markTaskAsCompleted(task)

	log.Printf("Successfully completed task %s", task.ID)
}

func (w *Worker) getNextPendingTask() (*models.Task, error) {
	search := &models.TaskSearch{
		Status:    models.StatusPending,
		Page:      1,
		PageSize:  1,
		SortBy:    "submitted_at",
		SortOrder: "asc",
	}

	tasks, err := w.repo.Search(search)
	if err != nil {
		log.Printf("Failed to search for pending tasks: %v", err)
		return nil, err
	}

	if len(tasks) == 0 {
		return nil, nil
	}

	return tasks[0], nil
}

func (w *Worker) markTaskAsRunning(task *models.Task) error {
	now := time.Now()
	task.Status = models.StatusRunning
	task.StartedAt = &now

	return w.repo.Update(task)
}

func (w *Worker) markTaskAsCompleted(task *models.Task) error {
	now := time.Now()
	task.Status = models.StatusCompleted
	task.CompletedAt = &now

	return w.repo.Update(task)
}

func (w *Worker) markTaskAsFailed(task *models.Task) error {
	now := time.Now()
	task.Status = models.StatusFailed
	task.CompletedAt = &now

	return w.repo.Update(task)
}
