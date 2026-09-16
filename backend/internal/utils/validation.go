package utils

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"time"

	"jobtrack/backend/internal/models"
)

var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func ValidateApplication(input map[string]any) error {
	company, _ := input["company"].(string)
	jobTitle, _ := input["jobTitle"].(string)
	location, _ := input["location"].(string)
	employmentType, _ := input["employmentType"].(string)
	status, _ := input["status"].(string)
	applicationDate, _ := input["applicationDate"].(string)
	jobURL, _ := input["jobUrl"].(string)
	notes, _ := input["notes"].(string)

	if strings.TrimSpace(company) == "" {
		return fmt.Errorf("company is required")
	}
	if strings.TrimSpace(jobTitle) == "" {
		return fmt.Errorf("jobTitle is required")
	}
	if strings.TrimSpace(location) == "" {
		return fmt.Errorf("location is required")
	}
	if strings.TrimSpace(employmentType) == "" {
		return fmt.Errorf("employmentType is required")
	}
	if !models.ValidApplicationStatus(status) {
		return fmt.Errorf("status is invalid")
	}
	if _, err := time.Parse("2006-01-02", applicationDate); err != nil {
		return fmt.Errorf("applicationDate must be in YYYY-MM-DD format")
	}
	if strings.TrimSpace(jobURL) != "" {
		if _, err := url.ParseRequestURI(jobURL); err != nil {
			return fmt.Errorf("jobUrl is invalid")
		}
	}
	if len(notes) > 2000 {
		return fmt.Errorf("notes too long")
	}
	return nil
}

func ValidateProfile(input map[string]any) error {
	firstName, _ := input["firstName"].(string)
	lastName, _ := input["lastName"].(string)
	displayName, _ := input["displayName"].(string)
	email, _ := input["email"].(string)
	country, _ := input["country"].(string)

	if strings.TrimSpace(firstName) == "" {
		return fmt.Errorf("firstName is required")
	}
	if strings.TrimSpace(lastName) == "" {
		return fmt.Errorf("lastName is required")
	}
	if strings.TrimSpace(displayName) == "" {
		return fmt.Errorf("displayName is required")
	}
	if !emailRegex.MatchString(email) {
		return fmt.Errorf("email is invalid")
	}
	if strings.TrimSpace(country) != "" && len(country) > 100 {
		return fmt.Errorf("country is too long")
	}
	return nil
}

func NormalizeDisplayName(firstName, lastName, displayName, email string) string {
	full := strings.TrimSpace(firstName + " " + lastName)
	if full != "" {
		return full
	}
	if strings.TrimSpace(displayName) != "" {
		return displayName
	}
	if strings.TrimSpace(email) != "" {
		parts := strings.Split(email, "@")
		if len(parts) > 0 && parts[0] != "" {
			return parts[0]
		}
	}
	return "User"
}
