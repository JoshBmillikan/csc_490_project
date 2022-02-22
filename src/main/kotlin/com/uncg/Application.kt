package com.uncg
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.uncg.plugins.*

fun main() {
    embeddedServer(Netty, port = Integer.parseInt(System.getenv("PORT")), host = "0.0.0.0") {
        configureRouting()
        configureSecurity()
        configureHTTP()
        configureMonitoring()
        configureTemplating()
        configureSerialization()
    }.start(wait = true)
}
