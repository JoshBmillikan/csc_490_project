package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.Static("/", "./www/")
	r.GET("/api", func(context *gin.Context) {
		context.String(200, "You have reached the api root for the csc 490 project server")
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
