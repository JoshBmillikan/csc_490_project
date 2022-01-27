package com.uncg

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.uncg.plugins.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureRouting()
        configureSecurity()
        configureHTTP()
        configureMonitoring()
        configureTemplating()
        configureSerialization()
    }.start(wait = true)
}
