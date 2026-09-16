package services

import (
    "context"
    "testing"
    "time"

    "jobtrack/backend/internal/models"
)

type testApplicationRepo struct {}

func (r *testApplicationRepo) ListByUser(_ context.Context, _ string) ([]models.JobApplication, error) {
    return []models.JobApplication{{
        ID:             "a-1",
        Company:        "Google",
        JobTitle:       "Engineer",
        Location:       "Remote",
        EmploymentType: "Full-time",
        Status:         "Applied",
        ApplicationDate: "2026-09-16",
        CreatedAt:      time.Now(),
        UpdatedAt:      time.Now(),
    }}, nil
}

func (r *testApplicationRepo) GetByUserAndID(_ context.Context, _, _ string) (*models.JobApplication, error) {
    return &models.JobApplication{ID: "a-1", Company: "Google", Status: "Applied"}, nil
}

func (r *testApplicationRepo) Create(_ context.Context, _ string, app models.JobApplication) (models.JobApplication, error) {
    return app, nil
}

func (r *testApplicationRepo) Update(_ context.Context, _ string, app models.JobApplication) (models.JobApplication, error) {
    return app, nil
}

func (r *testApplicationRepo) Delete(_ context.Context, _, _ string) error {
    return nil
}

func TestApplicationServiceDashboardStats(t *testing.T) {
    service := &ApplicationService{repo: &testApplicationRepo{}}
    stats, err := service.GetDashboardStats(context.Background(), "user-1")
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if stats.TotalApplications != 1 {
        t.Fatalf("expected total 1, got %d", stats.TotalApplications)
    }
    if stats.Interviews != 0 {
        t.Fatalf("expected interviews 0, got %d", stats.Interviews)
    }
    if stats.Offers != 0 {
        t.Fatalf("expected offers 0, got %d", stats.Offers)
    }
}
