package firebase

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebaseSDK "firebase.google.com/go"
	"google.golang.org/api/option"
)

var (
	App            *firebaseSDK.App
	FirestoreClient *firestore.Client
)

func Initialize(ctx context.Context, projectID string, credentialsPath string) error {
	var opts []option.ClientOption
	if credentialsPath != "" {
		if _, err := os.Stat(credentialsPath); err != nil {
			return fmt.Errorf("firebase credentials path invalid: %w", err)
		}
		opts = append(opts, option.WithCredentialsFile(credentialsPath))
	}

	config := &firebaseSDK.Config{ProjectID: projectID}
	app, err := firebaseSDK.NewApp(ctx, config, opts...)
	if err != nil {
		return fmt.Errorf("firebase initialize failed: %w", err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		return fmt.Errorf("firestore client creation failed: %w", err)
	}

	App = app
	FirestoreClient = client
	log.Println("Firebase Admin SDK initialized successfully")
	return nil
}

func GetFirestoreClient() *firestore.Client {
	return FirestoreClient
}

func Close() {
	if FirestoreClient != nil {
		if err := FirestoreClient.Close(); err != nil {
			log.Printf("failed to close Firestore client: %v", err)
		}
	}
}
