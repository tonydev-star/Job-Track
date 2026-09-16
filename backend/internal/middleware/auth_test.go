package middleware

import (
    "context"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestAuthMiddlewareMissingToken(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/", nil)
    rr := httptest.NewRecorder()

    verifyIDToken = func(_ context.Context, token string) (string, error) {
        t.Fatalf("verifyIDToken should not be called when token is missing")
        return "", nil
    }

    handler := AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        t.Fatalf("next handler should not run")
    }))

    handler.ServeHTTP(rr, req)
    if rr.Code != http.StatusUnauthorized {
        t.Fatalf("expected 401, got %d", rr.Code)
    }
}

func TestAuthMiddlewareValidToken(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/", nil)
    req.Header.Set("Authorization", "Bearer valid-token")
    rr := httptest.NewRecorder()

    verifyIDToken = func(_ context.Context, token string) (string, error) {
        if token != "valid-token" {
            t.Fatalf("expected valid-token, got %q", token)
        }
        return "user-123", nil
    }

    handler := AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        uid, err := GetUserID(r.Context())
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if uid != "user-123" {
            t.Fatalf("expected user-123, got %q", uid)
        }
        w.WriteHeader(http.StatusOK)
    }))

    handler.ServeHTTP(rr, req)
    if rr.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", rr.Code)
    }
}
