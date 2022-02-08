package com.uncg.plugins

import com.uncg.database.Account
import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import java.util.*
import kotlin.time.Duration

data class UserSession(val name:String,val id: UUID = UUID.randomUUID())

fun Application.configureSecurity() {
    install(Sessions) {
        cookie<UserSession>("USER_SESSION") {
            cookie.secure = true
            cookie.path = "/"
            cookie.extensions["SameSite"] = "lax"
        }
    }
    install(Authentication) {
        form("password") {
            userParamName = "username"
            passwordParamName = "password"
            validate {
                if (Account.checkPassword(it.name,it.password)) {
                    UserIdPrincipal(it.name)
                } else {null}
            }
        }
        session<UserSession>("login-session") {
            validate {
                TODO()
            }
        }
    }

    routing {
        authenticate("password") {
            post("/login") {
                val userName = call.principal<UserIdPrincipal>()?.name
                if(userName != null) {
                    call.sessions.set(UserSession(userName))
                    call.respond(HttpStatusCode.OK)
                } else {call.respond(HttpStatusCode.Unauthorized)}
            }
        }
    }
    TODO()


}