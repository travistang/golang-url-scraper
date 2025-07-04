package crawler

import (
	"backend/url_scraper/models"
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
	InaccessibleLinks int
}

type Scraper struct {
	client *http.Client
}

func NewScraper() *Scraper {
	return &Scraper{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (s *Scraper) ScrapeURL(targetURL string) (*ScrapingResult, error) {
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

func (s *Scraper) analyzeLinks(doc *goquery.Document, baseURL string, result *ScrapingResult) {
	parsedBase, err := url.Parse(baseURL)
	if err != nil {
		return
	}

	doc.Find("a[href]").Each(func(i int, link *goquery.Selection) {
		href, exists := link.Attr("href")
		if !exists {
			return
		}

		parsedHref, err := url.Parse(href)
		if err != nil {
			result.InaccessibleLinks++
			return
		}

		resolvedURL := parsedBase.ResolveReference(parsedHref)

		if resolvedURL.Host == parsedBase.Host {
			result.InternalLinks++
		} else if resolvedURL.Host != "" {
			result.ExternalLinks++
		}

		if s.isLinkAccessible(resolvedURL.String()) == false {
			result.InaccessibleLinks++
		}
	})
}

func (s *Scraper) isLinkAccessible(linkURL string) bool {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Head(linkURL)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode >= 200 && resp.StatusCode < 400
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
	task.InaccessibleLinks = &result.InaccessibleLinks
}
