package com.uncg.database

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.AppenderBase
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.javatime.timestamp
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.Instant

class Logging : AppenderBase<ILoggingEvent>(){
    object Logs : LongIdTable("log") {
        val threadName: Column<String> = varchar("thread_name",60)
        val level: Column<String> = varchar("level",10)
        val loggerName: Column<String> = varchar("logger_name",60)
        val timestamp: Column<Instant> = timestamp("timestamp")
        val message: Column<String> = text("message")
    }
    init {
        println(Logs.createStatement())
    }
    override fun append(eventObject: ILoggingEvent?) {
        if(eventObject != null && eventObject.loggerName != "com.zaxxer.hikari.pool.HikariPool") {
            transaction {
                Logs.insert {
                    it[threadName] = eventObject.threadName
                    it[level] = eventObject.level.levelStr
                    it[loggerName] = eventObject.loggerName
                    it[timestamp] = Instant.ofEpochMilli(eventObject.timeStamp)
                    it[message] = eventObject.message
                }
            }
        }
    }
}