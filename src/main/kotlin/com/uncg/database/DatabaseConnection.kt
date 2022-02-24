package com.uncg.database

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.name
import java.util.logging.Logger


object DatabaseConnection {
    val db: Database by lazy {
        val hostname: String = System.getenv("RDS_HOSTNAME")
        val dbName: String = System.getenv("RDS_DB_NAME")
        val user: String = System.getenv("RDS_USERNAME")
        val pass: String = System.getenv("RDS_PASSWORD")
        val port: String = System.getenv("RDS_PORT")
        val database = Database.connect(
            "jdbc:postgresql://${hostname}:${port}/${dbName}",
            "org.postgresql.Driver",
            user,
            pass,
        )
        Logger.getGlobal().info("Connected to database ${database.name} at ${database.url}")
        return@lazy database
    }
}