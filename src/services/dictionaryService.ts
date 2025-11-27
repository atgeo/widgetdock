interface Phonetic {
    text?: string
    audio?: string
    sourceUrl?: string
    license?: unknown
}

interface DictionaryEntry {
    word: string
    phonetics: Phonetic[]
}

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

const fetchPhonetic = async (word: string) => {
    const url = `${BASE_URL}/${encodeURIComponent(word)}`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`HTTP error status ${res.status}`)
    }

    const data: DictionaryEntry[] = await res.json()

    const entry = data[0]

    if (!entry?.phonetics?.length) return null

    const usAudio = entry.phonetics.find(p =>
        typeof p.audio === 'string' && p.audio.toLowerCase().includes('us')
    )

    const anyAudio = entry.phonetics.find(p => typeof p.audio === 'string')

    return usAudio?.audio ?? anyAudio?.audio ?? null
}

export {fetchPhonetic}
