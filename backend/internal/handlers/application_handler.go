package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"jobtrack/backend/internal/middleware"
	"jobtrack/backend/internal/services"
	"jobtrack/backend/internal/utils"
)

type ApplicationHandler struct {
	service *services.ApplicationService
}

func NewApplicationHandler(service *services.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{service: service}
}

func (h *ApplicationHandler) List(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}

	apps, err := h.service.List(r.Context(), uid)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to fetch applications")
		return
	}
	utils.WriteData(w, http.StatusOK, apps)
}

func (h *ApplicationHandler) Create(w http.ResponseWriter, r *http.Request) {
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

	app, err := h.service.Create(r.Context(), uid, input)
	if err != nil {
		switch {
		case strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "format") || strings.Contains(err.Error(), "too long"):
			utils.WriteError(w, http.StatusUnprocessableEntity, "VALIDATION_ERROR", err.Error())
		default:
			utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create application")
		}
		return
	}
	utils.WriteData(w, http.StatusCreated, app)
}

func (h *ApplicationHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/applications/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "application id is required")
		return
	}
	app, err := h.service.GetByID(r.Context(), uid, id)
	if err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "application not found")
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to fetch application")
		return
	}
	utils.WriteData(w, http.StatusOK, app)
}

func (h *ApplicationHandler) Update(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/applications/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "application id is required")
		return
	}

	var input map[string]any
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON payload")
		return
	}

	app, err := h.service.Update(r.Context(), uid, id, input)
	if err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "application not found")
			return
		}
		if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "format") || strings.Contains(err.Error(), "too long") {
			utils.WriteError(w, http.StatusUnprocessableEntity, "VALIDATION_ERROR", err.Error())
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update application")
		return
	}
	utils.WriteData(w, http.StatusOK, app)
}

func (h *ApplicationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/applications/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "application id is required")
		return
	}

	if err := h.service.Delete(r.Context(), uid, id); err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "application not found")
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to delete application")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
