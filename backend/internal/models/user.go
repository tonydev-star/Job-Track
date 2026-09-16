package models

import "time"

type UserProfile struct {
	UID         string    `json:"uid"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	DisplayName string    `json:"displayName"`
	Email       string    `json:"email"`
	Country     string    `json:"country,omitempty"`
	PhotoURL    string    `json:"photoURL,omitempty"`
	CreatedAt   time.Time `json:"createdAt,omitempty"`
	UpdatedAt   time.Time `json:"updatedAt,omitempty"`
}
