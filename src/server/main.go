package main

import (
	"crypto/rand"
	"github.com/JoshBmillikan/CSC_490_project/account"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
)

func main() {
	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	store := cookie.NewStore(getAuthKey())
	r.Use(sessions.Sessions("user_session", store))
	r.Static("/CSC_490_project/", "./www/")
	r.GET("/", func(context *gin.Context) {
		context.Redirect(301, "/CSC_490_project/")
	})
	api := r.Group("/api/")
	api.POST("/create_account", account.CreateAccount)
	api.GET("/", func(context *gin.Context) {
		context.String(200, "You have reached the api root for the csc 490 project server")
	})
	api.POST("/login", account.Login)
	auth := api.Group("/account/", func(context *gin.Context) {
		if !account.IsLoggedIn(context) {
			context.AbortWithStatus(http.StatusUnauthorized)
		}
	})
	auth.GET("/account_info") // todo
	if r.Run() != nil {
		os.Exit(-1)
	}
}

func getAuthKey() []byte {
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		log.Printf("Failed to genreate session secret")
		os.Exit(-10)
	}
	return b
}
