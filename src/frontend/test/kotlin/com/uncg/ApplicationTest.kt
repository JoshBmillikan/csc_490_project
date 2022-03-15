package com.uncg

import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*
import com.uncg.plugins.*

class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({ configureRouting() }) {
            //todo
        }
    }
}