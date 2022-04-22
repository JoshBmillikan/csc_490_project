package account

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/JoshBmillikan/CSC_490_project/database"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/argon2"
	"net/http"
	"strconv"
	"strings"
)

type creatInfo struct {
	Username string
	Email    string
	Password string
}

type loginInfo struct {
	Username string
	Password string
}

func Login(context *gin.Context) {
	var request loginInfo
	err := context.BindJSON(&request)
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}
	pass, id, err := database.GetUserPassword(request.Username)
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}

	parts := strings.Split(pass, "$")
	salt, err := base64.RawStdEncoding.DecodeString(parts[7])
	hash := hashPassword(request.Password, salt)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	if hash == pass {
		sessions.Default(context).Set("USER_ID", id)
		context.String(http.StatusOK, "login successful")
	} else {
		context.AbortWithStatus(http.StatusUnauthorized)
	}
}

func IsLoggedIn(context *gin.Context) bool {
	return sessions.Default(context).Get("USER_ID") != nil
}

func getNum(in string) (int, error) {
	parts := strings.Split(in, "=")
	return strconv.Atoi(parts[1])
}

func CreateAccount(context *gin.Context) {
	var request creatInfo
	err := context.BindJSON(&request)
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}
	if database.CheckUserExists(request.Username) {
		context.AbortWithStatus(http.StatusConflict)
	}
	salt, err := genSalt(16)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	hash := hashPassword(request.Password, salt)
	id, err := database.InsertAccount(request.Username, hash, request.Email)
	if err != nil {
		context.AbortWithStatus(http.StatusBadGateway)
	}
	sessions.Default(context).Set("USER_ID", id)
	context.String(http.StatusOK, "account creation successful")
}

type hashParams struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

func hashPassword(password string, salt []byte) string {
	params := &hashParams{
		memory:      64 * 1024,
		iterations:  3,
		parallelism: 2,
		saltLength:  uint32(len(salt)),
		keyLength:   32,
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		params.iterations,
		params.memory,
		params.parallelism,
		params.keyLength)

	result := encode(hash, salt, params)

	return result
}

func encode(rawHash []byte, rawSalt []byte, hashingContext *hashParams) string {
	salt := base64.RawStdEncoding.EncodeToString(rawSalt)
	hash := base64.RawStdEncoding.EncodeToString(rawHash)

	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d$t=%d$p=%d$%s$%s",
		argon2.Version, hashingContext.memory,
		hashingContext.iterations,
		hashingContext.parallelism,
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
