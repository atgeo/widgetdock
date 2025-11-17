import dotenv from 'dotenv'
import { flag, code, name, countries } from 'country-emoji'

dotenv.config()

export async function getNews() {
  const url = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&language=en&prioritydomain=top`
  const res = await fetch(url)
  const data = await res.json()

  return data.results.map(item => (
    {
      title: item.title,
      country: flag(item.country[0]),
      source: item.source_name,
    }
  ))
}
