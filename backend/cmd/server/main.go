package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"jobtrack/backend/firebase"
	"jobtrack/backend/internal/config"
	"jobtrack/backend/internal/middleware"
	"jobtrack/backend/internal/routes"
)

func main() {
	cfg := config.Load()

	ctx := context.Background()
	if err := firebase.Initialize(ctx, cfg.FirebaseProjectID, cfg.GoogleApplicationCredentials); err != nil {
		log.Fatalf("failed to initialize Firebase: %v", err)
	}
	defer firebase.Close()

	middleware.SetFirebaseApp(firebase.App)

	handler := routes.RegisterRoutes()
	server := &http.Server{
		Addr:         cfg.Addr(),
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	log.Printf("JobTrack API listening on %s", cfg.Addr())
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
	_ = os.Stdout
}
