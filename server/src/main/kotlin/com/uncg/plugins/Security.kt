package com.uncg.plugins

import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.features.*
import io.ktor.routing.*
import java.util.*
import kotlin.time.Duration

data class UserSession(val id: UUID)

fun Application.configureSecurity() {
    install(Sessions) {
        cookie<UserSession>("USER_SESSION") {
            cookie.secure = true
            cookie.httpOnly = true
            cookie.path = "/"
            cookie.extensions["SameSite"] = "lax"
        }
    }
    install(Authentication) {
        form("password") {
            //todo
        }
        session<UserSession>("login-session") {
            //todo
        }
    }

    routing {
        authenticate("password") {
            get("/login") {
                //todo
            }
        }
    }
    TODO()


}