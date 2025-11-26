let accessToken = null

async function loadAccessToken () {
  const res = await fetch('/auth/refresh-token', {
    method: 'POST',
    credentials: 'include',
  })

  if (res.ok) {
    const json = await res.json()
    accessToken = json.accessToken
  } else {
    accessToken = null
  }
}
