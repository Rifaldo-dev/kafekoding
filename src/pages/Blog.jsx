import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Search, Tag, ChevronLeft, X, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BLOG_DATA = [
  { id: 1, title: "Tips Belajar Koding Efektif untuk Pemula", date: "12 Apr 2026", excerpt: "Memulai karir di bidang IT memang menantang, namun dengan strategi yang tepat, kamu bisa menguasai programming dengan lebih cepat dan efisien.", img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400", category: "Tips", readTime: "5 min" },
  { id: 2, title: "Masa Depan PHP dan Laravel di Tahun 2026", date: "10 Apr 2026", excerpt: "Framework Laravel masih merajai pasar development global dengan fitur terbaru yang semakin memudahkan developer dalam membangun aplikasi web modern.", img: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&q=80&w=400", category: "Wawasan", readTime: "8 min" },
  { id: 3, title: "Pentingnya UI/UX di Mata Developer", date: "08 Apr 2026", excerpt: "Koding yang bagus tidak ada artinya jika pengalaman pengguna tidak nyaman. Mari pelajari bagaimana UI/UX yang baik dapat meningkatkan kualitas aplikasi.", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400", category: "Tutorial", readTime: "6 min" },
  { id: 4, title: "Roadmap Menjadi Full Stack Developer 2026", date: "05 Apr 2026", excerpt: "Panduan lengkap untuk menjadi full stack developer yang kompeten, mulai dari teknologi yang harus dipelajari hingga tips membangun portfolio.", img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400", category: "Karir", readTime: "10 min" },
  { id: 5, title: "Database Design Best Practices", date: "03 Apr 2026", excerpt: "Merancang database yang efisien dan scalable adalah kunci sukses aplikasi. Pelajari best practices dalam database design untuk project kamu.", img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400", category: "Tutorial", readTime: "7 min" },
  { id: 6, title: "JavaScript ES2026: Fitur Terbaru yang Wajib Diketahui", date: "01 Apr 2026", excerpt: "Eksplorasi fitur-fitur terbaru JavaScript ES2026 yang akan mengubah cara kita menulis kode dan meningkatkan produktivitas development.", img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=400", category: "Update", readTime: "9 min" },
  { id: 7, title: "Membangun API RESTful dengan Node.js", date: "28 Mar 2026", excerpt: "Tutorial step-by-step membangun API RESTful menggunakan Node.js dan Express, lengkap dengan authentication dan error handling.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400", category: "Tutorial", readTime: "12 min" },
  { id: 8, title: "Git Workflow untuk Tim Developer", date: "25 Mar 2026", excerpt: "Pelajari Git workflow yang efektif untuk kolaborasi tim, mulai dari branching strategy hingga code review process.", img: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=400", category: "Tips", readTime: "8 min" },
  { id: 9, title: "Optimasi Performance Website dengan React", date: "22 Mar 2026", excerpt: "Teknik-teknik optimasi untuk meningkatkan performance aplikasi React, dari code splitting hingga lazy loading.", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400", category: "Tutorial", readTime: "11 min" },
];

const CATEGORIES = ["Semua", "Tips", "Tutorial", "Wawasan", "Karir", "Update"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const articlesPerPage = 4;

  const filteredBlogs = BLOG_DATA.filter(blog => {
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-blue-700 mb-6">
            Aktivitas KafeKoding
          </h1>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsSearchModalOpen(true)} 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
            >
              <Search size={18} />
              Cari Artikel
            </button>
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Tidak ada artikel yang ditemukan.</p>
              <p className="text-slate-400 text-sm mt-2">Coba ubah kata kunci pencarian atau kategori.</p>
            </div>
          ) : (
            <>
              {/* Articles List */}
              <div className="space-y-6">
                {currentArticles.map((post) => (
                  <article key={post.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="relative overflow-hidden lg:w-96 lg:flex-shrink-0">
                        <div className="aspect-video lg:h-64">
                          <img 
                            src={post.img} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={post.title} 
                          />
                        </div>
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {post.category}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between min-h-64 lg:min-h-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 text-slate-500 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-blue-600" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag size={14} className="text-blue-600" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl lg:text-2xl font-bold text-blue-700 mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                          <button className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all group-hover:text-blue-700">
                            Baca Selengkapnya 
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      currentPage === 1
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Sebelumnya
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-100'
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      currentPage === totalPages
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Selanjutnya
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-700">Cari Artikel</h3>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit}>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Ketik kata kunci artikel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 outline-none transition-all text-lg"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Cari
                  </button>
                </div>
              </form>
              
              {searchTerm && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    {filteredBlogs.length} artikel ditemukan untuk "{searchTerm}"
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
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110"
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