package repositories

import (
	"context"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"jobtrack/backend/firebase"
	"jobtrack/backend/internal/models"
)

type InterviewRepository struct {
	client *firestore.Client
}

func NewInterviewRepository(client *firestore.Client) *InterviewRepository {
	if client == nil {
		client = firebase.GetFirestoreClient()
	}
	return &InterviewRepository{client: client}
}

func (r *InterviewRepository) ListByUser(ctx context.Context, userID string) ([]models.Interview, error) {
	docs, err := r.client.Collection("users").Doc(userID).Collection("interviews").Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}
	items := make([]models.Interview, 0, len(docs))
	for _, doc := range docs {
		var interview models.Interview
		if err := doc.DataTo(&interview); err != nil {
			return nil, err
		}
		interview.ID = doc.Ref.ID
		items = append(items, interview)
	}
	return items, nil
}

func (r *InterviewRepository) GetByUserAndID(ctx context.Context, userID, interviewID string) (*models.Interview, error) {
	doc, err := r.client.Collection("users").Doc(userID).Collection("interviews").Doc(interviewID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	var interview models.Interview
	if err := doc.DataTo(&interview); err != nil {
		return nil, err
	}
	interview.ID = doc.Ref.ID
	return &interview, nil
}

func (r *InterviewRepository) Create(ctx context.Context, userID string, interview models.Interview) (models.Interview, error) {
	_, _, err := r.client.Collection("users").Doc(userID).Collection("interviews").Add(ctx, map[string]any{
		"applicationId": interview.ApplicationID,
		"company":       interview.Company,
		"jobTitle":      interview.JobTitle,
		"interviewDate": interview.InterviewDate,
		"interviewType": interview.InterviewType,
		"notes":         interview.Notes,
		"createdAt":     interview.CreatedAt,
		"updatedAt":     interview.UpdatedAt,
	})
	if err != nil {
		return models.Interview{}, err
	}
	return interview, nil
}

func (r *InterviewRepository) Update(ctx context.Context, userID string, interview models.Interview) (models.Interview, error) {
	_, err := r.client.Collection("users").Doc(userID).Collection("interviews").Doc(interview.ID).Set(ctx, map[string]any{
		"applicationId": interview.ApplicationID,
		"company":       interview.Company,
		"jobTitle":      interview.JobTitle,
		"interviewDate": interview.InterviewDate,
		"interviewType": interview.InterviewType,
		"notes":         interview.Notes,
		"createdAt":     interview.CreatedAt,
		"updatedAt":     interview.UpdatedAt,
	}, firestore.MergeAll)
	if err != nil {
		return models.Interview{}, err
	}
	return interview, nil
}

func (r *InterviewRepository) Delete(ctx context.Context, userID, interviewID string) error {
	_, err := r.client.Collection("users").Doc(userID).Collection("interviews").Doc(interviewID).Delete(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return ErrNotFound
		}
		return err
	}
	return nil
}
