package com.uncg.plugins

import com.uncg.database.Account
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.locations.*
import io.ktor.http.content.*
import io.ktor.features.*
import io.ktor.application.*
import io.ktor.request.*
import io.ktor.response.*

fun Application.configureRouting() {
    install(Locations) {
    }
    routing {
        // Static plugin. Try to access `/static/index.html`
        static("/src/kotlin/resources/static") {
            resources("src/kotlin/resources/static")
        }
        install(StatusPages) {
            exception<AuthenticationException> { cause ->
                call.respond(HttpStatusCode.Unauthorized)
            }
            exception<AuthorizationException> { cause ->
                call.respond(HttpStatusCode.Forbidden)
            }

        }
        get("/") {
            call.respondText { "CSC 490 project server" }
        }

        post("/create_account") {
            val params = call.receiveParameters()
            val username = params["username"]
            val password = params["password"]
            if(username != null && password != null) {
                Account.createAccount(username, password)
                //todo handle account creation errors
                call.respond(HttpStatusCode.OK)
            } else {call.respond(HttpStatusCode.BadRequest)}
        }
    }
}

class AuthenticationException : RuntimeException()
class AuthorizationException : RuntimeException()
