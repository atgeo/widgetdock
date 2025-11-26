document.getElementById('logoutBtn').addEventListener('click', async (e) => {
  e.preventDefault()

  try {
    const res = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (res.ok) {
      window.location.href = '/'
    } else {
      const data = await res.json()
      alert(data.message || 'Logout failed')
    }
  } catch (err) {
    console.error('Logout error:', err)
    alert('Logout failed')
  }
})
