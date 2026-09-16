package models

type DashboardStats struct {
	TotalApplications int `json:"totalApplications"`
	Interviews        int `json:"interviews"`
	Offers           int `json:"offers"`
	Rejected         int `json:"rejected"`
}
