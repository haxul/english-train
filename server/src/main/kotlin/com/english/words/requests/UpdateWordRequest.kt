package com.english.words.requests

import javax.validation.constraints.NotBlank

data class UpdateWordRequest(

        val wordId:Int,

        @field:NotBlank(message = "value cannot be empty")
        val value: String,

        @field:NotBlank(message = "translation cannot be empty")
        val translation: String

)