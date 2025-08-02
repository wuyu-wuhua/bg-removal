const PEXELS_API_KEY = 'g49RJIQ47rZ0PGWvpCKAUBTwZgnrNH7RwpqMiZjrMXc1IEFsjkReixzu'
const PEXELS_API_BASE_URL = 'https://api.pexels.com/v1'

export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

export interface PexelsSearchResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page?: string
  prev_page?: string
}

export interface PexelsCuratedResponse {
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page?: string
}

/**
 * 搜索Pexels图片
 */
export async function searchPexelsPhotos(
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<PexelsSearchResponse> {
  const url = `${PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 获取精选图片
 */
export async function getCuratedPhotos(
  page: number = 1,
  perPage: number = 20
): Promise<PexelsCuratedResponse> {
  const url = `${PEXELS_API_BASE_URL}/curated?page=${page}&per_page=${perPage}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 获取特定图片详情
 */
export async function getPhotoById(id: number): Promise<PexelsPhoto> {
  const url = `${PEXELS_API_BASE_URL}/photos/${id}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 获取热门背景图片（风景、自然等）
 */
export async function getPopularBackgrounds(
  page: number = 1,
  perPage: number = 20
): Promise<PexelsSearchResponse> {
  // 搜索一些适合作为背景的图片类型
  const backgroundQueries = [
    'landscape',
    'nature',
    'sky',
    'ocean',
    'mountain',
    'forest',
    'beach',
    'sunset',
    'cityscape',
    'abstract'
  ]
  
  // 随机选择一个查询词
  const randomQuery = backgroundQueries[Math.floor(Math.random() * backgroundQueries.length)]
  
  return searchPexelsPhotos(randomQuery, page, perPage)
} 