package crawler

import (
	"backend/url_scraper/models"
	"backend/url_scraper/repositories"
	"fmt"
	"log"
	"time"
)

/*
*
* Worker for crawling tasks.  Also deals with start / stop logic and repository updates
 */
type Worker struct {
	repo        repositories.TaskRepository
	scraper     *Scraper
	quit        chan bool
	currentTask *models.Task
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
	w.scraper.Interrupt()
	w.quit <- true
}

func (w *Worker) Interrupt() {
	w.currentTask = nil
	w.scraper.Interrupt()
}

func (w *Worker) HasCurrentTask() bool {
	return w.currentTask != nil
}

func (w *Worker) Resume() {
	w.scraper.Resume()
}

func (w *Worker) processNextTask() {
	fmt.Println("Processing next task")
	if w.currentTask != nil {
		fmt.Println("There are already tasks being processed")
		return
	}

	task, err := w.getNextPendingTask()
	if err != nil {
		fmt.Println("Error getting next pending task")
		return
	}

	if task == nil {
		fmt.Println("No suitable next task found")
		return
	}

	w.currentTask = task
	log.Printf("Processing task %s for URL: %s", task.ID, task.URL)

	if err := w.markTaskAs(task, models.StatusRunning); err != nil {
		log.Printf("Failed to mark task %s as running: %v", task.ID, err)
		w.currentTask = nil
		return
	}

	result, err := w.scraper.ScrapeURL(task.URL)
	if err != nil {
		log.Printf("Failed to scrape URL %s: %v", task.URL, err)
		w.markTaskAs(task, models.StatusFailed)
	} else {
		w.scraper.UpdateTaskWithResults(task, result)
		w.markTaskAs(task, models.StatusCompleted)
		log.Printf("Successfully completed task %s", task.ID)
	}

	w.currentTask = nil
}

func (w *Worker) getNextPendingTask() (*models.Task, error) {
	search := &models.TaskSearch{
		Status:    models.StatusPending,
		Page:      0,
		PageSize:  1,
		SortBy:    "requestProcessingAt",
		SortOrder: "asc",
	}

	searchResult, err := w.repo.Search(search)
	fmt.Println("get next pending task", searchResult)
	if err != nil {
		log.Printf("Failed to search for pending tasks: %v", err)
		return nil, err
	}

	if len(searchResult.Tasks) == 0 {
		return nil, nil
	}

	return searchResult.Tasks[0], nil
}

func (w *Worker) markTaskAs(task *models.Task, status models.TaskStatus) error {
	now := time.Now()
	task.Status = status

	switch status {
	case models.StatusRunning:
		task.StartedAt = &now
	case models.StatusCompleted, models.StatusFailed:
		task.CompletedAt = &now
	case models.StatusPending:
		task.StartedAt = nil
	}

	return w.repo.Update(task)
}
