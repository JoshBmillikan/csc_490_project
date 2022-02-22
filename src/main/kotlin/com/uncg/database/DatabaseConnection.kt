package com.uncg.database

import org.jetbrains.exposed.sql.Database


object DatabaseConnection {
    val db: Database by lazy {
        val hostname: String = System.getenv("RDS_HOSTNAME")
        val dbName: String = System.getenv("RDS_DB_NAME")
        val user: String = System.getenv("RDS_USERNAME")
        val pass: String = System.getenv("RDS_PASSWORD")
        val port: String = System.getenv("RDS_PORT")
        return@lazy Database.connect(
            "jdbc:postgresql://${hostname}:${port}/${dbName}",
            "org.postgresql.Driver",
            user,
            pass,
        )
    }
}