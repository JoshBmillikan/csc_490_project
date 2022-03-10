package main

import (
	"context"
	"fmt"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v4/pgxpool"
	"os"
)

func connectDatabase() *pgxpool.Pool {
	conn, err := pgxpool.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error connecting to database: %v\n", err)
		os.Exit(-1)
	}
	return conn
}

func checkUserExists(username string) bool {
	connection := connectDatabase()
	defer connection.Close()
	err := connection.QueryRow(
		context.Background(),
		"SELECT exists (SELECT 1 FROM users WHERE username = $1 LIMIT 1);",
		username).Scan()
	if err == pgx.ErrNoRows {
		return false
	} else if err != nil {
		fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
		return false
	}
	return true
}

func insertAccount(username string, password string, email string) error {
	connection := connectDatabase()
	defer connection.Close()

	_, err := connection.Exec(context.Background(), "INSERT INTO users VALUES($1, $2, $3)", username, password, email)
	return err
}
