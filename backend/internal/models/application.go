package models

import "time"

type JobApplication struct {
	ID             string    `json:"id"`
	Company        string    `json:"company"`
	JobTitle       string    `json:"jobTitle"`
	Location       string    `json:"location"`
	EmploymentType string    `json:"employmentType"`
	Status         string    `json:"status"`
	ApplicationDate string   `json:"applicationDate"`
	JobURL         string    `json:"jobUrl,omitempty"`
	Notes          string    `json:"notes,omitempty"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

func ValidApplicationStatus(status string) bool {
	switch status {
	case "Applied", "Interview", "Offer", "Rejected", "Withdrawn":
		return true
	default:
		return false
	}
}
