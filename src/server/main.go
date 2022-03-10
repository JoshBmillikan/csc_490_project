package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.Static("/CSC_490_project/", "./www/")
	r.GET("/", func(context *gin.Context) {
		context.Redirect(301, "/CSC_490_project/")
	})
	r.POST("/api/create_account", createAccount)
	r.GET("/api", func(context *gin.Context) {
		context.String(200, "You have reached the api root for the csc 490 project server")
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
