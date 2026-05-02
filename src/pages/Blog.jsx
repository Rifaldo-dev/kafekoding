import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Search, Tag, ChevronLeft, X, ChevronUp, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchMediumArticles } from '../services/api';

const BLOG_DATA = [
  { id: 1, title: "Tips Belajar Koding Efektif untuk Pemula", date: "12 Apr 2026", excerpt: "Memulai karir di bidang IT memang menantang, namun dengan strategi yang tepat, kamu bisa menguasai programming dengan lebih cepat dan efisien.", img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800", category: "Tips", readTime: "5 min", author: "KafeKoding" },
  { id: 2, title: "Masa Depan PHP dan Laravel di Tahun 2026", date: "10 Apr 2026", excerpt: "Framework Laravel masih merajai pasar development global dengan fitur terbaru yang semakin memudahkan developer dalam membangun aplikasi web modern.", img: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&q=80&w=800", category: "Wawasan", readTime: "8 min", author: "KafeKoding" },
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [blogs, setBlogs] = useState(BLOG_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 7; // 1 featured + 6 grid
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlogs = async () => {
      setIsLoading(true);
      const articles = await fetchMediumArticles();
      if (articles && articles.length > 0) {
        setBlogs(articles);
      }
      setIsLoading(false);
    };
    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredBlogs.slice(startIndex, startIndex + articlesPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setIsSearchModalOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    if (isSearchModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSearchModalOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredPost = currentArticles[0];
  const gridPosts = currentArticles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tulisan Kami</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl">
              Temukan berbagai artikel, tutorial, dan wawasan terbaru seputar dunia teknologi langsung dari anggota KafeKoding Community.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setIsSearchModalOpen(true)} 
              className="group inline-flex items-center gap-3 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all font-medium text-lg w-full md:w-auto"
            >
              <Search className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
              Cari Artikel...
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {isLoading ? (
            <div className="text-center py-24">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-6"></i>
              <p className="text-slate-500 font-medium text-lg">Memuat konten terbaru...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Tidak ada artikel ditemukan</h3>
              <p className="text-slate-500">Coba gunakan kata kunci lain untuk pencarian Anda.</p>
            </div>
          ) : (
            <>
              {/* Featured Article (First Post) */}
              {featuredPost && (
                <div className="mb-16">
                  <article 
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                    className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col lg:flex-row h-full"
                  >
                    {/* Image Area */}
                    <div className="relative overflow-hidden lg:w-3/5 aspect-video lg:aspect-auto">
                      <img 
                        src={featuredPost.img} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        alt={featuredPost.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent lg:hidden"></div>
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        {featuredPost.category}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-8 lg:p-12 lg:w-2/5 flex flex-col justify-center">
                      <div className="flex items-center gap-6 text-slate-500 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600" />
                          <span className="font-medium">{featuredPost.date}</span>
                        </div>
                        {featuredPost.readTime && (
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-blue-600" />
                            <span className="font-medium">{featuredPost.readTime}</span>
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                        {featuredPost.author && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                              <User size={20} />
                            </div>
                            <span className="font-bold text-slate-800">{featuredPost.author}</span>
                          </div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ArrowRight size={20} className="group-hover:-rotate-45 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Grid Articles */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post) => (
                    <article 
                      key={post.id} 
                      onClick={() => navigate(`/blog/${post.id}`)} 
                      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img 
                          src={post.img} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={post.title} 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {post.category}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-y-2 items-center justify-between text-slate-500 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-600" />
                            <span className="font-medium">{post.date}</span>
                          </div>
                          {post.readTime && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-400">{post.readTime}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                          {post.author && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                                <User size={14} />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 line-clamp-1">{post.author}</span>
                            </div>
                          )}
                          <span className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight size={20} />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16 pb-8">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                      currentPage === 1
                        ? 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-50'
                        : 'text-slate-700 bg-white shadow-sm hover:shadow-md border border-slate-200 hover:text-blue-600 hover:border-blue-200'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2 mx-2 sm:mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                      currentPage === totalPages
                        ? 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-50'
                        : 'text-slate-700 bg-white shadow-sm hover:shadow-md border border-slate-200 hover:text-blue-600 hover:border-blue-200'
                    }`}
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">Cari Sesuatu?</h3>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit}>
                <div className="relative mb-8">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                  <input
                    type="text"
                    placeholder="Ketik judul atau isi artikel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all text-xl font-medium text-slate-800 placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Bersihkan
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-md hover:shadow-lg"
                  >
                    Tampilkan Hasil
                  </button>
                </div>
              </form>
              
              {searchTerm && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-slate-500 font-medium">
                    Menemukan <span className="text-blue-600 font-bold">{filteredBlogs.length}</span> artikel untuk "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl hover:bg-blue-600 hover:-translate-y-2 transition-all duration-300"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Blog;