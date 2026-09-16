package repositories

import (
	"context"
	"errors"
	"fmt"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"jobtrack/backend/firebase"
	"jobtrack/backend/internal/models"
)

var ErrNotFound = errors.New("not found")

type ApplicationRepository struct {
	client *firestore.Client
}

func NewApplicationRepository(client *firestore.Client) *ApplicationRepository {
	if client == nil {
		client = firebase.GetFirestoreClient()
	}
	return &ApplicationRepository{client: client}
}

func (r *ApplicationRepository) ListByUser(ctx context.Context, userID string) ([]models.JobApplication, error) {
	docs, err := r.client.Collection("users").Doc(userID).Collection("applications").Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}
	applications := make([]models.JobApplication, 0, len(docs))
	for _, doc := range docs {
		var app models.JobApplication
		if err := doc.DataTo(&app); err != nil {
			return nil, err
		}
		app.ID = doc.Ref.ID
		applications = append(applications, app)
	}
	return applications, nil
}

func (r *ApplicationRepository) GetByUserAndID(ctx context.Context, userID, applicationID string) (*models.JobApplication, error) {
	doc, err := r.client.Collection("users").Doc(userID).Collection("applications").Doc(applicationID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	var app models.JobApplication
	if err := doc.DataTo(&app); err != nil {
		return nil, err
	}
	app.ID = doc.Ref.ID
	return &app, nil
}

func (r *ApplicationRepository) Create(ctx context.Context, userID string, application models.JobApplication) (models.JobApplication, error) {
	_, _, err := r.client.Collection("users").Doc(userID).Collection("applications").Add(ctx, map[string]any{
		"company":        application.Company,
		"jobTitle":      application.JobTitle,
		"location":      application.Location,
		"employmentType": application.EmploymentType,
		"status":        application.Status,
		"applicationDate": application.ApplicationDate,
		"jobUrl":       application.JobURL,
		"notes":        application.Notes,
		"createdAt":    application.CreatedAt,
		"updatedAt":    application.UpdatedAt,
	})
	if err != nil {
		return models.JobApplication{}, err
	}
	return application, nil
}

func (r *ApplicationRepository) Update(ctx context.Context, userID string, application models.JobApplication) (models.JobApplication, error) {
	_, err := r.client.Collection("users").Doc(userID).Collection("applications").Doc(application.ID).Set(ctx, map[string]any{
		"company":        application.Company,
		"jobTitle":      application.JobTitle,
		"location":      application.Location,
		"employmentType": application.EmploymentType,
		"status":        application.Status,
		"applicationDate": application.ApplicationDate,
		"jobUrl":       application.JobURL,
		"notes":        application.Notes,
		"createdAt":    application.CreatedAt,
		"updatedAt":    application.UpdatedAt,
	}, firestore.MergeAll)
	if err != nil {
		return models.JobApplication{}, err
	}
	return application, nil
}

func (r *ApplicationRepository) Delete(ctx context.Context, userID, applicationID string) error {
	_, err := r.client.Collection("users").Doc(userID).Collection("applications").Doc(applicationID).Delete(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return ErrNotFound
		}
		return err
	}
	return nil
}

func (r *ApplicationRepository) CreateWithID(ctx context.Context, userID string, application models.JobApplication) (models.JobApplication, error) {
	if application.ID == "" {
		return models.JobApplication{}, fmt.Errorf("application id is required")
	}
	_, err := r.client.Collection("users").Doc(userID).Collection("applications").Doc(application.ID).Set(ctx, map[string]any{
		"company":         application.Company,
		"jobTitle":       application.JobTitle,
		"location":       application.Location,
		"employmentType": application.EmploymentType,
		"status":         application.Status,
		"applicationDate": application.ApplicationDate,
		"jobUrl":        application.JobURL,
		"notes":         application.Notes,
		"createdAt":     application.CreatedAt,
		"updatedAt":     application.UpdatedAt,
	})
	if err != nil {
		return models.JobApplication{}, err
	}
	return application, nil
}
