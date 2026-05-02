import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ExternalLink, ArrowLeft, ChevronUp, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchMediumArticles } from '../services/api';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showBackToTop, scrollToTop } = useScrollToTop();

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      const articles = await fetchMediumArticles();
      const found = articles.find(a => a.id === id);
      setArticle(found || null);
      setIsLoading(false);
      window.scrollTo(0, 0);
    };
    loadArticle();
  }, [id]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
            <ArrowLeft size={18} /> Kembali ke Artikel
          </Link>

          {isLoading ? (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-slate-500 font-medium">Memuat artikel...</p>
            </div>
          ) : !article ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h2>
              <p className="text-slate-500 mb-8">Artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
              <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Lihat Artikel Lainnya
              </Link>
            </div>
          ) : (
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-12 animate-in fade-in duration-500">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-slate-700">{article.author}</span>
                  </div>
                )}
                {article.author && <span className="text-slate-300">•</span>}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span>{article.date}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-blue-600" />
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{article.category}</span>
                </div>
                {article.readTime && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-2">
                      <span>{article.readTime}</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
                {article.title}
              </h1>
              
              {/* Hero Image */}
              {article.img && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-lg">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Article HTML Content */}
              <div 
                className="prose prose-lg prose-slate max-w-none prose-img:rounded-2xl prose-img:shadow-lg prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt}</p>` }}
              />
              
              {/* Footer / Read on Medium link */}
              {article.link && (
                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-slate-500 italic">Terima kasih telah membaca!</p>
                  <a 
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1"
                  >
                    Baca Selengkapnya di Medium <ExternalLink size={18} />
                  </a>
                </div>
              )}
            </article>
          )}
        </div>
      </main>

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

export default Article;
