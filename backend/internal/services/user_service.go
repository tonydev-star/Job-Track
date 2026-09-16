package services

import (
	"context"
	"errors"
	"jobtrack/backend/internal/models"
)

type UserRepository interface {
	GetProfile(ctx context.Context, userID string) (*models.UserProfile, error)
	UpdateProfile(ctx context.Context, userID string, profile models.UserProfile) (*models.UserProfile, error)
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetProfile(ctx context.Context, userID string) (*models.UserProfile, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	return s.repo.GetProfile(ctx, userID)
}

func (s *UserService) UpdateProfile(ctx context.Context, userID string, profile models.UserProfile) (*models.UserProfile, error) {
	if userID == "" {
		return nil, errors.New("user id is required")
	}
	if profile.UID != "" && profile.UID != userID {
		return nil, errors.New("uid mismatch")
	}
	profile.UID = userID
	return s.repo.UpdateProfile(ctx, userID, profile)
}
