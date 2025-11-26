document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#loginForm')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault() // prevent normal page reload
    const username = form.username.value
    const password = form.password.value

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login failed')

      const accessToken = data.accessToken
      // store in memory for API calls
      window.accessToken = accessToken
      console.log('Login success! Access token:', accessToken)

      // redirect or show logged-in UI
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err.message)
      alert(err.message)
    }
  })
})
