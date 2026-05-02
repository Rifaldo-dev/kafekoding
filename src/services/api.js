const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kafekoding-api.muhammadrifaldosaputra.workers.dev';
const REGISTRATION_API_KEY = import.meta.env.VITE_REGISTRATION_API_KEY || '';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.registrationApiKey = REGISTRATION_API_KEY;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000), // 8 second timeout
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getClasses() {
    try {
      // Race between API call and timeout
      const apiPromise = this.request(`/api/classes?_t=${Date.now()}`);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 5000)
      );
      
      const result = await Promise.race([apiPromise, timeoutPromise]);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      return [];
    }
  }

  async getMentors() {
    try {
      const result = await this.request('/api/mentors');
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      return [];
    }
  }

  async getBlogArticles(page = 1, limit = 10) {
    try {
      const result = await this.request(`/api/blog?page=${page}&limit=${limit}`);
      return result.success ? result : { data: [], pagination: {} };
    } catch (error) {
      console.error('Failed to fetch blog articles:', error);
      return { data: [], pagination: {} };
    }
  }

  async submitRegistration(registrationData) {
    try {
      const secureData = {
        full_name: registrationData.fullName,
        whatsapp_number: registrationData.whatsappNumber,
        institution: registrationData.institution,
        selected_classes: registrationData.selectedClasses,
        instagram_proof_url: registrationData.instagramProofUrl || null
      };

      const result = await this.request('/api/register', {
        method: 'POST',
        headers: {
          'X-API-Key': this.registrationApiKey
        },
        body: JSON.stringify(secureData)
      });

      return result;
    } catch (error) {
      console.error('Failed to submit registration:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else if (error.message.includes('Unauthorized') || error.message.includes('Invalid API key')) {
        throw new Error('Terjadi kesalahan sistem. Silakan hubungi admin.');
      } else if (error.message.includes('Rate limit exceeded')) {
        throw new Error('Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.');
      } else if (error.message.includes('Validation failed')) {
        throw new Error('Data yang dimasukkan tidak valid. Periksa kembali form Anda.');
      } else if (error.message.includes('already exists')) {
        throw new Error('Data sudah terdaftar. Silakan gunakan data yang berbeda.');
      } else {
        throw new Error('Terjadi kesalahan. Silakan coba lagi dalam beberapa saat.');
      }
    }
  }

  // File upload endpoint
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await this.request('/api/upload', {
        method: 'POST',
        headers: {
          'X-API-Key': this.registrationApiKey
        },
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    try {
      const result = await this.request('/health');
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }
}

// Preload classes data immediately when service is imported
let cachedClasses = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Preload function
const preloadClasses = async () => {
  try {
    if (cachedClasses && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      return cachedClasses;
    }
    
    const apiService = new ApiService();
    const classes = await apiService.getClasses();
    
    if (classes && classes.length > 0) {
      cachedClasses = classes;
      cacheTimestamp = Date.now();
    }
    
    return classes;
  } catch (error) {
    console.error('Preload classes failed:', error);
    return [];
  }
};

// Start preloading immediately
preloadClasses();

// Create instance
const apiService = new ApiService();

export const fetchClasses = async (forceRefresh = false) => {
  // Try to get cached data first unless forced
  if (!forceRefresh && cachedClasses && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('[API] Using cached classes data');
    return cachedClasses;
  }
  
  const classes = await apiService.getClasses();
  if (classes && classes.length > 0) {
    cachedClasses = classes;
    cacheTimestamp = Date.now();
  }
  return classes;
};
export const fetchMentors = () => apiService.getMentors();
export const fetchBlogArticles = (page, limit) => apiService.getBlogArticles(page, limit);

export const fetchMediumArticles = async () => {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/kafekoding');
    const data = await response.json();
    
    if (data.status === 'ok') {
      return data.items.map((item, index) => {
        let img = item.thumbnail;
        if (!img) {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
          img = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400';
        }
        
        const date = new Date(item.pubDate).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
        
        // Remove tracking pixel img at the end if it exists
        let cleanContent = item.content.replace(/<img[^>]+src="https:\/\/medium\.com\/_\/stat[^>]+>/g, '');
        
        return {
          id: item.guid ? item.guid.split('/').pop() : `medium-${index}`,
          title: item.title,
          date: date,
          author: item.author || 'KafeKoding',
          excerpt: cleanContent.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
          content: cleanContent,
          link: item.link,
          img: img,
          category: item.categories && item.categories.length > 0 ? item.categories[0] : 'Blog',
          readTime: Math.ceil(cleanContent.replace(/<[^>]+>/g, '').split(' ').length / 200) + ' min'
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from Medium:', error);
    return [];
  }
};
export const submitRegistration = (data) => apiService.submitRegistration(data);
export const uploadFile = (file) => apiService.uploadFile(file);
export const checkApiHealth = () => apiService.checkHealth();

export default apiService;