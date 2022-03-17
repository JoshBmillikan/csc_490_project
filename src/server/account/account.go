package account

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/JoshBmillikan/CSC_490_project/database"
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
	pass, err := database.GetUserPassword(request.Username)
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
	}
	parts := strings.Split(pass, "$")
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	hash := parts[5]

	mem, err := getNum(parts[1])
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	iter, err := getNum(parts[2])
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	par, err := getNum(parts[3])
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}

	params := &hashParams{
		memory:      uint32(mem),
		iterations:  uint32(iter),
		parallelism: uint8(par),
		saltLength:  uint32(len(salt)),
		keyLength:   uint32(len(hash)),
	}

	newHash := argon2.IDKey(
		[]byte(request.Password),
		salt,
		params.iterations,
		params.memory,
		params.parallelism,
		params.keyLength)

	encoded := base64.RawStdEncoding.EncodeToString(newHash)

	if encoded == hash {
		setSessionCookie(request.Username, context)
		context.String(http.StatusOK, "login successful")
	} else {
		context.AbortWithStatus(http.StatusUnauthorized)
	}
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

	hash, err := hashPassword(request.Password)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}
	err = database.InsertAccount(request.Username, hash, request.Email)
	if err != nil {
		context.AbortWithStatus(http.StatusBadGateway)
	}
	setSessionCookie(request.Username, context)
	context.String(http.StatusOK, "account creation successful")
}

func setSessionCookie(username string, context *gin.Context) {
	session, err := newSession(username)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}
	cookie, err := json.Marshal(session)
	if err != nil {
		context.AbortWithStatus(http.StatusInternalServerError)
	}
	context.SetCookie(
		"SHADER_VIEW_SESSION",
		string(cookie),
		1209600,
		"/",
		"csc490.azurewebsites.net",
		true,
		true)
}

type hashParams struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

func hashPassword(password string) (string, error) {
	params := &hashParams{
		memory:      64 * 1024,
		iterations:  3,
		parallelism: 2,
		saltLength:  16,
		keyLength:   32,
	}

	salt, err := genSalt(params.saltLength)
	if err != nil {
		return "", err
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		params.iterations,
		params.memory,
		params.parallelism,
		params.keyLength)

	result := encode(hash, salt, params)

	return result, nil
}

func encode(rawHash []byte, rawSalt []byte, hashingContext *hashParams) string {
	salt := base64.RawStdEncoding.EncodeToString(rawSalt)
	hash := base64.RawStdEncoding.EncodeToString(rawHash)

	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
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
