package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tvdburgt/go-argon2"
	"net/http"
)

type AccountCreatInfo struct {
	Username string
	Email    string
	Password string
}

func createAccount(context *gin.Context) {
	var request AccountCreatInfo
	err := context.BindJSON(&request)
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}
	if checkUserExists(request.Username) {
		context.AbortWithStatus(http.StatusConflict)
	}

	hash, err := hashPassword(request.Password)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}
	err = insertAccount(request.Username, hash, request.Email)
	if err != nil {
		context.AbortWithStatus(http.StatusBadGateway)
	}
	context.String(http.StatusOK, "account creation successful")
}

func hashPassword(password string) (string, error) {
	hashingContext := argon2.NewContext()
	salt, err := genSalt(16)
	if err != nil {
		return "", err
	}

	hash, err := argon2.Hash(hashingContext, []byte(password), salt)
	if err != nil {
		return "", err
	}

	result := encode(hash, salt, hashingContext)

	return result, nil
}

func encode(rawHash []byte, rawSalt []byte, hashingContext *argon2.Context) string {
	salt := base64.RawStdEncoding.EncodeToString(rawSalt)
	hash := base64.RawStdEncoding.EncodeToString(rawHash)

	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		hashingContext.Version, hashingContext.Memory,
		hashingContext.Iterations,
		hashingContext.Parallelism,
		salt,
		hash)
}

func genSalt(n uint32) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}

	return b, nil
}
