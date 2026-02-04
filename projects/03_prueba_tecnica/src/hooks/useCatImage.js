import { useState, useEffect } from 'react'
import { getImageUrl } from '../services/getImage.js'

const CAT_IMAGE_URL = 'https://cataas.com/cat/says/#firstPart#?size=50&color=red&json=true'

export const useCatImage = ({ fact }) => {
  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    if (!fact) return
    const firstPart = fact.split(' ').slice(0, 3).join(' ')
    const imageUrl = CAT_IMAGE_URL.replace('#firstPart#', firstPart)
    console.log('Cat image URL:', imageUrl)
    getImageUrl(imageUrl).then(newUrl => setImageUrl(newUrl)).catch(err => console.error(err))
  }, [fact])
  return { imageUrl }
}
