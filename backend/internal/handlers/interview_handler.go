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

type InterviewHandler struct {
	service *services.InterviewService
}

func NewInterviewHandler(service *services.InterviewService) *InterviewHandler {
	return &InterviewHandler{service: service}
}

func (h *InterviewHandler) List(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	items, err := h.service.List(r.Context(), uid)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to fetch interviews")
		return
	}
	utils.WriteData(w, http.StatusOK, items)
}

func (h *InterviewHandler) Create(w http.ResponseWriter, r *http.Request) {
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
	item, err := h.service.Create(r.Context(), uid, input)
	if err != nil {
		if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "timestamp") {
			utils.WriteError(w, http.StatusUnprocessableEntity, "VALIDATION_ERROR", err.Error())
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create interview")
		return
	}
	utils.WriteData(w, http.StatusCreated, item)
}

func (h *InterviewHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/interviews/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "interview id is required")
		return
	}
	item, err := h.service.GetByID(r.Context(), uid, id)
	if err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "interview not found")
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to fetch interview")
		return
	}
	utils.WriteData(w, http.StatusOK, item)
}

func (h *InterviewHandler) Update(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/interviews/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "interview id is required")
		return
	}
	var input map[string]any
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON payload")
		return
	}
	item, err := h.service.Update(r.Context(), uid, id, input)
	if err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "interview not found")
			return
		}
		if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") || strings.Contains(err.Error(), "timestamp") {
			utils.WriteError(w, http.StatusUnprocessableEntity, "VALIDATION_ERROR", err.Error())
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update interview")
		return
	}
	utils.WriteData(w, http.StatusOK, item)
}

func (h *InterviewHandler) Delete(w http.ResponseWriter, r *http.Request) {
	uid, err := middleware.GetUserID(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "authentication required")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/interviews/")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, "VALIDATION_ERROR", "interview id is required")
		return
	}
	if err := h.service.Delete(r.Context(), uid, id); err != nil {
		if errors.Is(err, services.ErrNotFound) || strings.Contains(err.Error(), "not found") {
			utils.WriteError(w, http.StatusNotFound, "NOT_FOUND", "interview not found")
			return
		}
		utils.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to delete interview")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
