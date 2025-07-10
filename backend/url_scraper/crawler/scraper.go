package crawler

import (
	"backend/url_scraper/models"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

type ScrapingResult struct {
	HTMLVersion       string
	PageTitle         string
	HasLoginForm      bool
	H1Count           int
	H2Count           int
	H3Count           int
	H4Count           int
	H5Count           int
	H6Count           int
	InternalLinks     int
	ExternalLinks     int
	InaccessibleLinks []models.InaccessibleLink
}

/*
*
* Scraper for fetching information from URL
 */
type Scraper struct {
	client        *http.Client
	interruptChan chan bool
	resumeChan    chan bool
	interrupted   bool
}

func NewScraper() *Scraper {
	return &Scraper{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
		interruptChan: make(chan bool, 1),
		resumeChan:    make(chan bool, 1),
		interrupted:   false,
	}
}

func (s *Scraper) ScrapeURL(targetURL string) (*ScrapingResult, error) {
	if s.interrupted {
		fmt.Println("Scraper is interrupted, waiting for resume")
		<-s.resumeChan // Wait for resume signal if interrupted
		fmt.Println("Scraper resumed")
	}

	resp, err := s.client.Get(targetURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	htmlContent := string(bodyBytes)
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(htmlContent))
	if err != nil {
		return nil, err
	}

	result := &ScrapingResult{}

	result.HTMLVersion = s.extractHTMLVersion(htmlContent)
	result.PageTitle = s.extractPageTitle(doc)
	result.HasLoginForm = s.hasLoginForm(doc)
	result.H1Count = doc.Find("h1").Length()
	result.H2Count = doc.Find("h2").Length()
	result.H3Count = doc.Find("h3").Length()
	result.H4Count = doc.Find("h4").Length()
	result.H5Count = doc.Find("h5").Length()
	result.H6Count = doc.Find("h6").Length()

	s.analyzeLinks(doc, targetURL, result)

	return result, nil
}

func (s *Scraper) extractHTMLVersion(htmlContent string) string {
	htmlLower := strings.ToLower(htmlContent)

	if strings.Contains(htmlLower, "<!doctype html>") {
		return "HTML5"
	}

	if strings.Contains(htmlLower, "xhtml") {
		return "XHTML"
	}

	if strings.Contains(htmlLower, "<!doctype") {
		return "HTML4"
	}

	return "Unknown"
}

func (s *Scraper) extractPageTitle(doc *goquery.Document) string {
	title := doc.Find("title").First().Text()
	return strings.TrimSpace(title)
}

func (s *Scraper) hasLoginForm(doc *goquery.Document) bool {
	hasPasswordField := doc.Find("input[type='password']").Length() > 0
	hasLoginKeywords := false

	doc.Find("form").Each(func(i int, form *goquery.Selection) {
		formText := strings.ToLower(form.Text())
		if strings.Contains(formText, "login") ||
			strings.Contains(formText, "sign in") ||
			strings.Contains(formText, "log in") {
			hasLoginKeywords = true
		}

		form.Find("input").Each(func(j int, input *goquery.Selection) {
			if name, exists := input.Attr("name"); exists {
				name = strings.ToLower(name)
				if strings.Contains(name, "login") ||
					strings.Contains(name, "username") ||
					strings.Contains(name, "email") {
					hasLoginKeywords = true
				}
			}
		})
	})

	return hasPasswordField && hasLoginKeywords
}

func addInaccessibleLink(result *ScrapingResult, href string, statusCode int) {
	result.InaccessibleLinks = append(result.InaccessibleLinks, models.InaccessibleLink{
		URL:        href,
		StatusCode: statusCode,
	})
}

func (s *Scraper) analyzeLinks(doc *goquery.Document, baseURL string, result *ScrapingResult) {
	parsedBase, err := url.Parse(baseURL)
	if err != nil {
		return
	}

	links := make([]string, 0)

	doc.Find("a[href]").Each(func(i int, link *goquery.Selection) {
		href, exists := link.Attr("href")
		if !exists {
			return
		}

		parsedHref, err := url.Parse(href)
		if err != nil {
			addInaccessibleLink(result, href, 0)
			return
		}

		resolvedURL := parsedBase.ResolveReference(parsedHref)

		fmt.Println("Resolved Host:", resolvedURL.Host)
		fmt.Println("Parsed Base Host:", parsedBase.Host)
		if resolvedURL.Host == parsedBase.Host {
			result.InternalLinks++
		} else if resolvedURL.Host != "" {
			result.ExternalLinks++
		}

		links = append(links, resolvedURL.String())
	})

	for _, link := range links {
		select {
		case <-s.interruptChan:
			fmt.Println("Interrupted, skipping link analysis")
			return
		default:
			if accessible, statusCode := s.linkAccessibility(link); !accessible {
				fmt.Println("Inaccessible link:", link, "Status code:", statusCode)
				addInaccessibleLink(result, link, statusCode)
			}
		}

	}
}

func (s *Scraper) Interrupt() {
	select {
	case s.interruptChan <- true:
		s.interrupted = true
	default:
		fmt.Println("Scraper is already interrupted")
	}
}

func (s *Scraper) Resume() {
	select {
	case s.resumeChan <- true:
		s.interrupted = false
	default:
		fmt.Println("Scraper is already resumed")
	}
}

func (s *Scraper) linkAccessibility(linkURL string) (bool, int) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Head(linkURL)
	if err != nil {
		fmt.Println("Error getting link accessibility", err)
		statusCode := 0
		if resp != nil {
			statusCode = resp.StatusCode
		}
		return false, statusCode
	}
	defer resp.Body.Close()

	return resp.StatusCode >= 200 && resp.StatusCode < 400, resp.StatusCode
}

func (s *Scraper) UpdateTaskWithResults(task *models.Task, result *ScrapingResult) {
	task.HTMLVersion = &result.HTMLVersion
	task.PageTitle = &result.PageTitle
	task.HasLoginForm = &result.HasLoginForm
	task.H1Count = &result.H1Count
	task.H2Count = &result.H2Count
	task.H3Count = &result.H3Count
	task.H4Count = &result.H4Count
	task.H5Count = &result.H5Count
	task.H6Count = &result.H6Count
	task.InternalLinks = &result.InternalLinks
	task.ExternalLinks = &result.ExternalLinks
	task.InaccessibleLinks = result.InaccessibleLinks
}
