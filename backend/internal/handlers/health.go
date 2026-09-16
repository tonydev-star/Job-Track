package handlers

import (
	"net/http"

	"jobtrack/backend/internal/utils"
)

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	utils.WriteJSON(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "jobtrack-api",
	})
}
