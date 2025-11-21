import {db} from './db.js'
import {widgets} from './schema.js'

async function seed() {
    await db.insert(widgets).values([
        {name: 'weather', type: 'ticker'},
        {name: 'news', type: 'ticker'},
        {name: 'passage', type: 'reading'},
        {name: 'dialogue', type: 'reading'},
        {name: 'synonyms', type: 'quiz'},
        {name: 'synonyms_beginner', type: 'quiz'},
    ])
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
