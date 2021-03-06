import React, {useState} from "react"
import "./addWordPage.css"
import {baseUrl, createAuthHeaders} from "../../utils/connection"

async function saveWord(word, translation) {
    const token = localStorage.getItem("token")
    if (!token) document.location.reload(true)
    const body = {
        value: word,
        translation
    }
    const response = await fetch(`${baseUrl}/words`, {
        headers: createAuthHeaders(token),
        method: "POST",
        body: JSON.stringify(body)
    })
    if (response.status === 200) {
        return await response.json()
    }
    return null
}

async function translateByGoogle(russianWord) {
    const token = localStorage.getItem("token")
    const account = localStorage.getItem("account")
    if (!token || !account) document.location.reload()

    const url =  baseUrl + "/words/amazon/translation"
    const body = {
        "text": russianWord
    }
    const response = await fetch(url, {
        method: "POST",
        headers : createAuthHeaders(token),
        body: JSON.stringify(body)
    })
    if (response.status === 200) {
        const data = await response.json()
        return data.result
    }
    return null
}

export function AddWordPage() {
    const [windowText, setWindowText] = useState("")
    const [translationText, setTranslationText] = useState("")
    const [addedWord, setAddedWord] = useState("")
    const [isError, setError] = useState(false)
    const [isInputMistake, setInputMistake] = useState(false)
    let timer = null

    const handleButtonToAddWord = async () => {
        if (isError || isInputMistake) return
        if (!windowText || !translationText || !addedWord) return
        const response = await saveWord(windowText, addedWord)
        if (!response) {
            setInputMistake(true)
            return
        }
        document.querySelector("#window").value = ""
        setAddedWord("")
        setWindowText("")
        setTranslationText("")
    }
    const handleAddedWordInput = (e) => {
        setInputMistake(false)
        setAddedWord(e.target.value)
    }
    const handleWindowText = (e) => {
        setInputMistake(false)
        setError(false)
        clearTimeout(timer)
        const text = e.target.value
        if (!/^[а-яА-ЯёЁ0-9\,\,\.\s]*$/.test(text)) {
            setError(true)
            return
        }
        timer = setTimeout(() => getTranslation(text), 1000)
    }

    const getTranslation = async (phrase) => {
        if (!phrase) return
        const text = await translateByGoogle(phrase)
        if (!text) {
            setError(true)
            return
        }
        setWindowText(phrase)
        setTranslationText(text)
    }
    return (
        <div className="container-fluid wrapper">
            <div className={"row justify-content-center"}>
                <p className={"headerForGoogle"}>Google - Translater</p>
            </div>
            <div className="row justify-content-center">
                <div className={`col-4  `}>
                    <textarea id="window" className={`window ${isError ? "errorStatus" : ""}`}
                              onChange={handleWindowText}/>
                </div>

                <div className="translation col-4">
                    {translationText}
                </div>
            </div>

            <div className={"row justify-content-center mt-5"}>
                <div className={"col-3"}>
                    <input className={`inputAddWord ${isInputMistake ? "errorStatus" : ""}`} value={addedWord}
                           onChange={handleAddedWordInput}/>
                    <button className={"buttonAddWord"} onClick={handleButtonToAddWord}>
                        <i className="fa fa-plus-circle"/>
                    </button>
                </div>
            </div>
        </div>

    )
}
