export const getImageUrl = (url) => {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    })
    .then(response => {
      const { url } = response
      return url
    })
}
