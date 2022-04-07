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

func GetUserPassword(username string) (string, int, error) {
	connection := connectDatabase()
	defer connection.Close()

	row := connection.QueryRow(context.Background(), "SELECT id, password FROM users WHERE username=$1;", username)
	var pass string
	var id int
	err := row.Scan(&id, &pass)
	if err != nil {
		return "", 0, err
	}
	return pass, id, nil
}

func InsertAccount(username string, password string, email string) (int, error) {
	connection := connectDatabase()
	defer connection.Close()

	id := 0
	err := connection.QueryRow(context.Background(), "INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING id", username, password, email).Scan(&id)
	return id, err
}
