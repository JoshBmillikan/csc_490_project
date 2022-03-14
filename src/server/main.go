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
	api := r.Group("/api/")
	api.POST("/create_account", account.CreateAccount)
	api.GET("/", func(context *gin.Context) {
		context.String(200, "You have reached the api root for the csc 490 project server")
	})
	api.POST("/login", account.Login)
	auth := api.Group("/account/", account.SessionAuth)
	auth.GET("/account_info") // todo
	r.Run()
}
