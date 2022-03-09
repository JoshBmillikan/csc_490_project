package main

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4"
	"os"
)

var connection *pgx.Conn

func connectDatabase() {
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error connecting to database: %v\n", err)
		os.Exit(-1)
	}
	connection = conn
}

func closeDatabase() {
	err := connection.Close(context.Background())
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error closing database: %v\n", err)
		return
	}
}
