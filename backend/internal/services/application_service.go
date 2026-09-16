package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"jobtrack/backend/internal/models"
	"jobtrack/backend/internal/repositories"
	"jobtrack/backend/internal/utils"
)

var ErrNotFound = errors.New("not found")

type ApplicationRepository interface {
	ListByUser(ctx context.Context, userID string) ([]models.JobApplication, error)
	GetByUserAndID(ctx context.Context, userID, applicationID string) (*models.JobApplication, error)
	Create(ctx context.Context, userID string, application models.JobApplication) (models.JobApplication, error)
	Update(ctx context.Context, userID string, application models.JobApplication) (models.JobApplication, error)
	Delete(ctx context.Context, userID, applicationID string) error
}

type ApplicationService struct {
	repo ApplicationRepository
}

func NewApplicationService(repo ApplicationRepository) *ApplicationService {
	return &ApplicationService{repo: repo}
}

func (s *ApplicationService) List(ctx context.Context, userID string) ([]models.JobApplication, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	return s.repo.ListByUser(ctx, userID)
}

func (s *ApplicationService) GetByID(ctx context.Context, userID, applicationID string) (*models.JobApplication, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	if applicationID == "" {
		return nil, errors.New("application id is required")
	}
	app, err := s.repo.GetByUserAndID(ctx, userID, applicationID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return app, nil
}

func (s *ApplicationService) Create(ctx context.Context, userID string, input map[string]any) (models.JobApplication, error) {
	if userID == "" {
		return models.JobApplication{}, errors.New("user id is required")
	}
	if err := utils.ValidateApplication(input); err != nil {
		return models.JobApplication{}, err
	}

	application := models.JobApplication{
		ID:             fmt.Sprintf("app-%d", time.Now().UnixNano()),
		Company:        normalizeString(input["company"]),
		JobTitle:       normalizeString(input["jobTitle"]),
		Location:       normalizeString(input["location"]),
		EmploymentType: normalizeString(input["employmentType"]),
		Status:         normalizeString(input["status"]),
		ApplicationDate: normalizeString(input["applicationDate"]),
		JobURL:         normalizeString(input["jobUrl"]),
		Notes:          normalizeString(input["notes"]),
		CreatedAt:      time.Now().UTC(),
		UpdatedAt:      time.Now().UTC(),
	}

	return s.repo.Create(ctx, userID, application)
}

func (s *ApplicationService) Update(ctx context.Context, userID, applicationID string, input map[string]any) (models.JobApplication, error) {
	if userID == "" {
		return models.JobApplication{}, errors.New("user id is required")
	}
	if applicationID == "" {
		return models.JobApplication{}, errors.New("application id is required")
	}
	if err := utils.ValidateApplication(input); err != nil {
		return models.JobApplication{}, err
	}

	existing, err := s.repo.GetByUserAndID(ctx, userID, applicationID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return models.JobApplication{}, ErrNotFound
		}
		return models.JobApplication{}, err
	}
	if existing == nil {
		return models.JobApplication{}, errors.New("application not found")
	}

	updated := *existing
	updated.Company = normalizeString(input["company"])
	updated.JobTitle = normalizeString(input["jobTitle"])
	updated.Location = normalizeString(input["location"])
	updated.EmploymentType = normalizeString(input["employmentType"])
	updated.Status = normalizeString(input["status"])
	updated.ApplicationDate = normalizeString(input["applicationDate"])
	updated.JobURL = normalizeString(input["jobUrl"])
	updated.Notes = normalizeString(input["notes"])
	updated.UpdatedAt = time.Now().UTC()

	return s.repo.Update(ctx, userID, updated)
}

func (s *ApplicationService) Delete(ctx context.Context, userID, applicationID string) error {
	if userID == "" {
		return errors.New("user id is required")
	}
	if applicationID == "" {
		return errors.New("application id is required")
	}
	if err := s.repo.Delete(ctx, userID, applicationID); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrNotFound
		}
		return err
	}
	return nil
}

func (s *ApplicationService) GetDashboardStats(ctx context.Context, userID string) (models.DashboardStats, error) {
	applications, err := s.List(ctx, userID)
	if err != nil {
		return models.DashboardStats{}, err
	}

	stats := models.DashboardStats{}
	for _, app := range applications {
		stats.TotalApplications++
		switch app.Status {
		case "Interview":
			stats.Interviews++
		case "Offer":
			stats.Offers++
		case "Rejected":
			stats.Rejected++
		}
	}
	return stats, nil
}

func normalizeString(value any) string {
	if value == nil {
		return ""
	}
	switch v := value.(type) {
	case string:
		return v
	case fmt.Stringer:
		return v.String()
	default:
		return fmt.Sprintf("%v", v)
	}
}
