import {db} from './db.js'
import {widgets, prompts} from './schema.js'

async function seed() {
    try {
        const inserted = await db.insert(widgets).values([
            {name: 'weather', type: 'ticker'},
            {name: 'news', type: 'ticker'},
            {name: 'passage', type: 'text'},
            {name: 'dialogue', type: 'text'},
            {name: 'synonyms', type: 'quiz'},
            {name: 'synonyms_beginner', type: 'quiz'},
        ]).returning()

        const passageWidget = inserted.find(widget => widget.name === 'passage')
        const dialogueWidget = inserted.find(widget => widget.name === 'dialogue')
        const synonymsWidget = inserted.find(widget => widget.name === 'synonyms')
        const synonymsBeginnerWidget = inserted.find(widget => widget.name === 'synonyms_beginner')

        if (passageWidget) {
            await db.insert(prompts).values([
                {
                    widget_id: passageWidget.id,
                    prompt: 'Generate a short passage suitable for the IELTS General Reading section. Begin with a clear, concise title at the very top. The text should be challenging and formal in style, resembling real IELTS passages, but limited to around 200–250 words so it can be read quickly. Cover practical, real-world topics such as work, health, technology, social issues, travel, or everyday problem-solving, rather than trivial topics like gardens or hobbies. Include a few complex sentences and varied vocabulary, but keep it concise and self-contained.',
                },
            ])
        }

        if (dialogueWidget) {
            await db.insert(prompts).values([
                {
                    widget_id: dialogueWidget.id,
                    prompt: 'Generate a natural dialogue between two people in a common daily situation. At the beginning, write a short title that names the situation (for example: “Taking the Bus” or “Talking to a Neighbor”). Choose a situation from a wide range of daily experiences, such as: transportation and travel; home and family tasks; hobbies and free time; public services (library, post office, clinic, etc.); outdoor and community activities; plans, questions, opinions, or invitations. Use clear and common English that is easy for intermediate learners to understand. You may include a few simple expressions, but keep the language straightforward. Make the conversation realistic. Include 20–25 exchanges.',
                }
            ])
        }

        if (synonymsWidget) {
            await db.insert(prompts).values([
                {
                    widget_id: synonymsWidget.id,
                    prompt: 'You are a vocabulary quiz generator. Generate exactly 20 English words, each with 4 multiple-choice options. Rules: The first option must always be the correct synonym. The remaining 3 options must be plausible distractors. The words should be commonly found in IELTS tests. Output must be strictly a single JSON array of 20 objects, with no extra text. Each object must have this structure: {"word":"example_word","options":["correct_synonym","distractor1","distractor2","distractor3"]}. Generate 20 items following these rules exactly.',
                }
            ])
        }


        if (synonymsBeginnerWidget) {
            await db.insert(prompts).values([
                {
                    widget_id: synonymsBeginnerWidget.id,
                    prompt: 'You are a vocabulary quiz generator. Generate exactly 20 pre-intermediate English words, each with 4 multiple-choice options. Rules: The first option must always be the correct synonym. The remaining 3 options must be plausible distractors. Use clear, everyday pre-intermediate vocabulary (not too basic, not advanced). Output must be strictly a single JSON array of 20 objects, with no extra text. Each object must have this structure: {"word":"example_word","options":["correct_synonym","distractor1","distractor2","distractor3"]}. Generate 20 items following these rules exactly.',
                }
            ])
        }
    } finally {
        await db.$client.end()
    }
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
