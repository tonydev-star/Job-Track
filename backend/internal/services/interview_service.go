package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"jobtrack/backend/internal/models"
	"jobtrack/backend/internal/repositories"
)

var interviewNotFound = errors.New("not found")

type InterviewRepository interface {
	ListByUser(ctx context.Context, userID string) ([]models.Interview, error)
	GetByUserAndID(ctx context.Context, userID, interviewID string) (*models.Interview, error)
	Create(ctx context.Context, userID string, interview models.Interview) (models.Interview, error)
	Update(ctx context.Context, userID string, interview models.Interview) (models.Interview, error)
	Delete(ctx context.Context, userID, interviewID string) error
}

type InterviewService struct {
	repo InterviewRepository
}

func NewInterviewService(repo InterviewRepository) *InterviewService {
	return &InterviewService{repo: repo}
}

func (s *InterviewService) List(ctx context.Context, userID string) ([]models.Interview, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	return s.repo.ListByUser(ctx, userID)
}

func (s *InterviewService) GetByID(ctx context.Context, userID, interviewID string) (*models.Interview, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	if interviewID == "" {
		return nil, errors.New("interview id is required")
	}
	item, err := s.repo.GetByUserAndID(ctx, userID, interviewID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return item, nil
}

func (s *InterviewService) Create(ctx context.Context, userID string, input map[string]any) (models.Interview, error) {
	if userID == "" {
		return models.Interview{}, errors.New("user id is required")
	}
	if err := validateInterviewInput(input); err != nil {
		return models.Interview{}, err
	}

	interview := models.Interview{
		ID:            fmt.Sprintf("int-%d", time.Now().UnixNano()),
		ApplicationID: normalizeString(input["applicationId"]),
		Company:       normalizeString(input["company"]),
		JobTitle:      normalizeString(input["jobTitle"]),
		InterviewType: normalizeString(input["interviewType"]),
		Notes:         normalizeString(input["notes"]),
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
	}
	if v, ok := input["interviewDate"].(string); ok && v != "" {
		parsed, err := time.Parse(time.RFC3339, v)
		if err == nil {
			interview.InterviewDate = parsed
		} else {
			return models.Interview{}, errors.New("interviewDate must be a valid RFC3339 timestamp")
		}
	}
	return s.repo.Create(ctx, userID, interview)
}

func (s *InterviewService) Update(ctx context.Context, userID, interviewID string, input map[string]any) (models.Interview, error) {
	if userID == "" {
		return models.Interview{}, errors.New("user id is required")
	}
	if interviewID == "" {
		return models.Interview{}, errors.New("interview id is required")
	}
	if err := validateInterviewInput(input); err != nil {
		return models.Interview{}, err
	}

	existing, err := s.repo.GetByUserAndID(ctx, userID, interviewID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return models.Interview{}, ErrNotFound
		}
		return models.Interview{}, err
	}
	if existing == nil {
		return models.Interview{}, errors.New("interview not found")
	}

	updated := *existing
	updated.ApplicationID = normalizeString(input["applicationId"])
	updated.Company = normalizeString(input["company"])
	updated.JobTitle = normalizeString(input["jobTitle"])
	updated.InterviewType = normalizeString(input["interviewType"])
	updated.Notes = normalizeString(input["notes"])
	updated.UpdatedAt = time.Now().UTC()
	if v, ok := input["interviewDate"].(string); ok && v != "" {
		parsed, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return models.Interview{}, errors.New("interviewDate must be a valid RFC3339 timestamp")
		}
		updated.InterviewDate = parsed
	}
	return s.repo.Update(ctx, userID, updated)
}

func (s *InterviewService) Delete(ctx context.Context, userID, interviewID string) error {
	if userID == "" {
		return errors.New("user id is required")
	}
	if interviewID == "" {
		return errors.New("interview id is required")
	}
	if err := s.repo.Delete(ctx, userID, interviewID); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrNotFound
		}
		return err
	}
	return nil
}

func validateInterviewInput(input map[string]any) error {
	if normalizeString(input["company"]) == "" {
		return errors.New("company is required")
	}
	if normalizeString(input["jobTitle"]) == "" {
		return errors.New("jobTitle is required")
	}
	if normalizeString(input["interviewType"]) == "" {
		return errors.New("interviewType is required")
	}
	if _, ok := input["interviewDate"].(string); ok && normalizeString(input["interviewDate"]) != "" {
		if _, err := time.Parse(time.RFC3339, normalizeString(input["interviewDate"])); err != nil {
			return errors.New("interviewDate must be a valid RFC3339 timestamp")
		}
	}
	return nil
}
