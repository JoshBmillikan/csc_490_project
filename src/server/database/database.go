package database

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

func CheckUserExists(username string) bool {
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

func GetUserPassword(username string) (string, error) {
	connection := connectDatabase()
	defer connection.Close()

	row := connection.QueryRow(context.Background(), "SELECT password FROM users WHERE username=$1;", username)
	var pass string
	err := row.Scan(&pass)
	if err != nil {
		return "", err
	}
	return pass, nil
}

func InsertAccount(username string, password string, email string) error {
	connection := connectDatabase()
	defer connection.Close()

	_, err := connection.Exec(context.Background(), "INSERT INTO users(username, password, email) VALUES($1, $2, $3)", username, password, email)
	return err
}
