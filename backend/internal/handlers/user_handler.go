package handlers

import (
	"encoding/json"
	"net/http"

	"jobtrack/backend/internal/middleware"
	"jobtrack/backend/internal/models"
	"jobtrack/backend/internal/services"
	"jobtrack/backend/internal/utils"
)

type UserHandler struct {
	service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	profile, err := h.service.GetProfile(r.Context(), uid)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load profile")
		return
	}
	utils.WriteData(w, http.StatusOK, profile)
}

func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	var input map[string]any
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON payload")
		return
	}
	profile, err := h.service.UpdateProfile(r.Context(), uid, mapToUserProfile(input, uid))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	utils.WriteData(w, http.StatusOK, profile)
}

func mapToUserProfile(input map[string]any, uid string) models.UserProfile {
	return models.UserProfile{
		UID:         uid,
		FirstName:   valueString(input["firstName"]),
		LastName:    valueString(input["lastName"]),
		DisplayName: valueString(input["displayName"]),
		Email:       valueString(input["email"]),
		Country:     valueString(input["country"]),
		PhotoURL:    valueString(input["photoURL"]),
	}
}

func valueString(v any) string {
	if v == nil {
		return ""
	}
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
