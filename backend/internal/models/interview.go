package models

import "time"

type Interview struct {
	ID            string    `json:"id"`
	ApplicationID string    `json:"applicationId"`
	Company       string    `json:"company"`
	JobTitle      string    `json:"jobTitle"`
	InterviewDate time.Time `json:"interviewDate"`
	InterviewType string    `json:"interviewType"`
	Notes         string    `json:"notes,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}
