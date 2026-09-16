package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"

	firebase "firebase.google.com/go"
)

const userIDContextKey = "userID"

var FirebaseApp *firebase.App

var verifyIDToken = func(ctx context.Context, token string) (string, error) {
	if FirebaseApp == nil {
		return "", errors.New("firebase app not initialized")
	}
	client, err := FirebaseApp.Auth(ctx)
	if err != nil {
		return "", err
	}
	decoded, err := client.VerifyIDToken(ctx, token)
	if err != nil {
		return "", err
	}
	return decoded.UID, nil
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
			http.Error(w, "invalid authorization header", http.StatusUnauthorized)
			return
		}

		uid, err := verifyIDToken(r.Context(), parts[1])
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDContextKey, uid)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserID(ctx context.Context) (string, error) {
	uid, ok := ctx.Value(userIDContextKey).(string)
	if !ok || uid == "" {
		return "", errors.New("user id not found in context")
	}
	return uid, nil
}

func SetFirebaseApp(app *firebase.App) {
	FirebaseApp = app
}
