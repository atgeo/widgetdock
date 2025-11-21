import {db} from './db.js'
import {widgets, prompts} from './schema.js'

type Widget = typeof widgets.$inferSelect;

async function seed() {
    const inserted = await db.insert(widgets).values([
        {name: 'weather', type: 'ticker'},
        {name: 'news', type: 'ticker'},
        {name: 'passage', type: 'reading'},
        {name: 'dialogue', type: 'reading'},
        {name: 'synonyms', type: 'quiz'},
        {name: 'synonyms_beginner', type: 'quiz'},
    ]).returning()

    const passageWidget = inserted.find(widget => widget.name === 'passage')
    const dialogueWidget = inserted.find(widget => widget.name === 'dialogue')

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
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
