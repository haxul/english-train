package com.english.users.exceptions

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@ControllerAdvice
class ExceptionController : ResponseEntityExceptionHandler() {

    override fun handleMethodArgumentNotValid(ex: MethodArgumentNotValidException, headers: HttpHeaders, status: HttpStatus, request: WebRequest): ResponseEntity<Any> {
        val notValidArgumentError = ErrorMessage("Error", ex.message)
        return ResponseEntity(notValidArgumentError, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [UserExistsException::class])
    fun handleAnyException(ex: Exception?, request: WebRequest?): ResponseEntity<Any?>? {
        val errorMessage = ErrorMessage("Error", "User exists")
        return ResponseEntity(errorMessage, HttpHeaders(), HttpStatus.BAD_REQUEST)
    }
}