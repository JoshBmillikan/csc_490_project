package com.uncg.database

import org.bouncycastle.crypto.generators.Argon2BytesGenerator
import org.bouncycastle.crypto.params.Argon2Parameters
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import java.security.SecureRandom

object Account : IntIdTable() {
    val userName: Column<String> = varchar("username", 60)
    val password: Column<ByteArray> = binary("password", 64)
    val salt: Column<ByteArray> = binary("salt", 16)

    fun checkPassword(name: String, pass: String): Boolean {
        val result = transaction {
            Account.slice(password, salt).select { userName eq name }.distinct()
        }.first()
        val hash = Hasher.hashPassword(pass, result[salt])
        return hash.contentEquals(result[password])
    }

    fun createAccount(username: String, pass: String) {
        val hashSalt = Hasher.generateSalt()
        val hashedPass = Hasher.hashPassword(pass,hashSalt)
        transaction {
            Account.insert {
                it[userName] = username
                it[password] = hashedPass
                it[salt] = hashSalt
            }
        }
    }

    private object Hasher {
        private val generator = Argon2BytesGenerator()
        private const val size: Int = 64

        fun generateSalt(count: Int = 16): ByteArray {
            val bytes = ByteArray(16)
            val rand = SecureRandom()
            rand.nextBytes(bytes)
            return bytes
        }

        fun hashPassword(password: String, salt: ByteArray): ByteArray {
            val params = Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withSalt(salt)
                .withIterations(5)
                .withMemoryAsKB(1048576)
                .withParallelism(1)
                .withVersion(Argon2Parameters.ARGON2_VERSION_13)
                .build()
            generator.init(params)

            val out = ByteArray(size)
            generator.generateBytes(password.toByteArray(),out)
            return out
        }
    }
}