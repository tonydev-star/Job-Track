package utils

import (
	"encoding/json"
	"net/http"
)

type ErrorPayload struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error ErrorPayload `json:"error"`
}

type DataResponse struct {
	Data any `json:"data"`
}

func WriteJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if payload == nil {
		return
	}
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}

func WriteError(w http.ResponseWriter, statusCode int, code, message string) {
	WriteJSON(w, statusCode, ErrorResponse{
		Error: ErrorPayload{Code: code, Message: message},
	})
}

func WriteData(w http.ResponseWriter, statusCode int, data any) {
	WriteJSON(w, statusCode, DataResponse{Data: data})
}
