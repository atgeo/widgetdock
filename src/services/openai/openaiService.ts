import OpenAI from 'openai'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

if (!process.env.OPENAI_MODEL) {
    throw new Error('MODEL environment variable is required')
}

const model = process.env.OPENAI_MODEL

const generateText = async (prompt: string) => {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'developer',
                content: 'You are a helpful assistant.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: model,
    })

    return completion.choices?.[0]?.message.content || 'No content returned'
}

export {generateText}
