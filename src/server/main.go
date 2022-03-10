package main

import "github.com/gin-gonic/gin"
import "./account"

func main() {
	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Static("/CSC_490_project/", "./www/")
	r.GET("/", func(context *gin.Context) {
		context.Redirect(301, "/CSC_490_project/")
	})
	r.POST("/api/create_account", account.CreateAccount)
	r.GET("/api", func(context *gin.Context) {
		context.String(200, "You have reached the api root for the csc 490 project server")
	})
	auth := r.Group("/account/", account.SessionAuth)
	auth.GET("/api/account_info") // todo
	r.Run()
}
