const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en"

export async function fetchDefinition(word: string) {
    const url = `${BASE_URL}/${encodeURIComponent(word)}`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`HTTP error status ${res.status}`)
    }

    return res.json()
}
