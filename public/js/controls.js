let scrolling = false
let speed = document.querySelector('meta[name="speed"]')?.content || 0.6
const toggleBtn = document.getElementById('toggleBtn')
const refreshBtn = document.getElementById("refreshBtn")

const scrollStep = () => {
  if (!scrolling) return
  window.scrollBy(0, speed)
  requestAnimationFrame(scrollStep)
}

const toggleScroll = () => {
  scrolling = !scrolling

  if (scrolling) {
    toggleBtn.textContent = 'Pause'
    scrollStep()
  } else {
    toggleBtn.textContent = 'Play'
  }
}

toggleBtn.addEventListener('click', toggleScroll)
refreshBtn.addEventListener('click', () => {
  document.getElementById('reader').innerHTML = '<p>Loading...</p>'
  loadText(true)
})
