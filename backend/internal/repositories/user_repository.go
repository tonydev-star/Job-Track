package repositories

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"jobtrack/backend/firebase"
	"jobtrack/backend/internal/models"
)

type UserRepository struct {
	client *firestore.Client
}

func NewUserRepository(client *firestore.Client) *UserRepository {
	if client == nil {
		client = firebase.GetFirestoreClient()
	}
	return &UserRepository{client: client}
}

func (r *UserRepository) GetProfile(ctx context.Context, userID string) (*models.UserProfile, error) {
	doc, err := r.client.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		return nil, err
	}
	profile := &models.UserProfile{}
	if err := doc.DataTo(profile); err != nil {
		return nil, err
	}
	profile.UID = userID
	return profile, nil
}

func (r *UserRepository) UpdateProfile(ctx context.Context, userID string, profile models.UserProfile) (*models.UserProfile, error) {
	profile.UID = userID
	profile.UpdatedAt = time.Now().UTC()
	if profile.CreatedAt.IsZero() {
		profile.CreatedAt = time.Now().UTC()
	}
	_, err := r.client.Collection("users").Doc(userID).Set(ctx, map[string]any{
		"uid":         profile.UID,
		"firstName":   profile.FirstName,
		"lastName":    profile.LastName,
		"displayName": profile.DisplayName,
		"email":       profile.Email,
		"country":     profile.Country,
		"photoURL":    profile.PhotoURL,
		"createdAt":   profile.CreatedAt,
		"updatedAt":   profile.UpdatedAt,
	}, firestore.MergeAll)
	if err != nil {
		return nil, err
	}
	return &profile, nil
}
