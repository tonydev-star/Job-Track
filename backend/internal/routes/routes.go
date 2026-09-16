package routes

import (
	"net/http"

	"jobtrack/backend/internal/handlers"
	"jobtrack/backend/internal/middleware"
	"jobtrack/backend/internal/repositories"
	"jobtrack/backend/internal/services"
	"jobtrack/backend/internal/utils"
)

func RegisterRoutes() http.Handler {
	mux := http.NewServeMux()

	appRepo := repositories.NewApplicationRepository(nil)
	interviewRepo := repositories.NewInterviewRepository(nil)
	userRepo := repositories.NewUserRepository(nil)

	appService := services.NewApplicationService(appRepo)
	interviewService := services.NewInterviewService(interviewRepo)
	userService := services.NewUserService(userRepo)

	appHandler := handlers.NewApplicationHandler(appService)
	interviewHandler := handlers.NewInterviewHandler(interviewService)
	userHandler := handlers.NewUserHandler(userService)

	mux.HandleFunc("/health", handlers.HealthHandler)

	api := http.NewServeMux()
	api.HandleFunc("/api/v1/applications", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			appHandler.List(w, r)
		case http.MethodPost:
			appHandler.Create(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	api.HandleFunc("/api/v1/applications/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			appHandler.GetByID(w, r)
		case http.MethodPut:
			appHandler.Update(w, r)
		case http.MethodDelete:
			appHandler.Delete(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	api.HandleFunc("/api/v1/interviews", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			interviewHandler.List(w, r)
		case http.MethodPost:
			interviewHandler.Create(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	api.HandleFunc("/api/v1/interviews/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			interviewHandler.GetByID(w, r)
		case http.MethodPut:
			interviewHandler.Update(w, r)
		case http.MethodDelete:
			interviewHandler.Delete(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	api.HandleFunc("/api/v1/profile", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			userHandler.GetProfile(w, r)
		case http.MethodPut:
			userHandler.UpdateProfile(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	api.HandleFunc("/api/v1/dashboard/stats", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		uid, err := middleware.GetUserID(r.Context())
		if err != nil {
			utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
			return
		}
		stats, err := appService.GetDashboardStats(r.Context(), uid)
		if err != nil {
			utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load dashboard stats")
			return
		}
		utils.WriteData(w, http.StatusOK, stats)
	})

	mux.Handle("/health", middleware.CORS(http.HandlerFunc(handlers.HealthHandler)))
	mux.Handle("/api/", middleware.CORS(middleware.AuthMiddleware(api)))
	return mux
}
