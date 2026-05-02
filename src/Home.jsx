import { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Calendar, 
  ChevronUp,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ASSETS, STATS_DATA, CLASSES_DATA, MENTORS_DATA, BLOG_DATA } from './data/constants';
import { fetchClasses, fetchMediumArticles } from './services/api';
import { InstagramIcon, GithubIcon, LinkedinIcon } from './components/Icons';
import { useScrollToTop } from './hooks/useScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './css/hero.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};



const Home = memo(() => {
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [showAllMentors, setShowAllMentors] = useState(false);
  const [classes, setClasses] = useState(CLASSES_DATA); // Start with fallback data immediately
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [blogs, setBlogs] = useState(BLOG_DATA);
  const { showBackToTop, scrollToTop } = useScrollToTop();
  const navigate = useNavigate();

  useEffect(() => {
    // AOS initialization removed to fix white page issue
    
    // Load API data in background
    loadClasses();
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const articles = await fetchMediumArticles();
    if (articles && articles.length > 0) {
      setBlogs(articles);
    }
  };

  const loadClasses = async (forceRefresh = false) => {
    try {
      setIsLoadingClasses(true);
      console.log('[HOME] Loading classes from API...');
      const classesData = await fetchClasses(forceRefresh);
      
      if (classesData && classesData.length > 0) {
        setClasses(classesData);
      } else {
        console.log('[HOME] Using fallback data from constants.js');
        setClasses(CLASSES_DATA);
      }
    } catch (error) {
      console.error('[HOME] Failed to load classes:', error);
      console.log('[HOME] Using fallback data from constants.js');
      setClasses(CLASSES_DATA);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-20">
        
        <section id="home" className="hero-section">
          <div className="hero-background">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
              alt="KafeKoding Community Background" 
              className="hero-background-img"
            />
            <div className="hero-background-overlay"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <h1 className="hero-title">
              Welcome to <span className="hero-title-highlight">Kafekoding</span>
            </h1>
            
            
            <div className="hero-buttons justify-center mt-8">
              <a href="/daftar" className="hero-btn-primary">
                Gabung Komunitas
              </a>
              <a 
                href="#tentang" 
                className="hero-btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </motion.div>
        </section>

        <section className="bg-blue-600 py-12 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="contents"
            >
              {STATS_DATA.map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="text-center"
                >
                  <motion.div 
                    className="text-3xl font-bold mb-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="tentang" className="bg-blue-50 py-12 px-6 md:py-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInVariants}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <motion.h2 
                variants={fadeInUpVariants}
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4"
              >
                Tentang Kami
              </motion.h2>
              <motion.p 
                variants={fadeInUpVariants}
                className="text-base md:text-lg text-blue-600 mb-4 md:mb-6 font-medium"
              >
                "Kami Memilih Turun Tangan"
              </motion.p>
              
              <div className="lg:hidden mb-6 md:mb-8 flex justify-center">
                <motion.img 
                  src={ASSETS.ABOUT_IMAGE} 
                  className="rounded-xl shadow-lg h-40 md:h-48 w-full max-w-sm object-cover" 
                  alt="Dokumentasi KafeKoding"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              
              <motion.div 
                className="space-y-3 md:space-y-4 text-slate-600 leading-relaxed text-justify mb-6 md:mb-8 text-sm md:text-base"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {[
                  "Komunitas Kafe Koding merupakan wadah belajar dan berbagi di bidang teknologi informasi yang berfokus pada pengembangan kemampuan anggota secara individu maupun tim sesuai kebutuhan industri.",
                  "Dengan semangat kolaborasi, komunitas ini menyediakan lingkungan yang aktif, sehat, dan produktif bagi mahasiswa maupun masyarakat umum untuk berdiskusi, berlatih, serta mengembangkan keterampilan di dunia IT."
                ].map((text, i) => (
                  <motion.p key={i} variants={itemVariants}>
                    {text}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRightVariants}
              className="hidden lg:block lg:w-1/2 grid grid-cols-1 gap-4"
            >
              <motion.img 
                src={ASSETS.ABOUT_IMAGE} 
                className="rounded-xl shadow-lg h-64 object-cover w-full" 
                alt="Dokumentasi KafeKoding"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </section>

        <section id="kelas" className="py-12 md:py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mx-auto">Pilihan Kelas</h2>
              <button 
                onClick={() => loadClasses(true)}
                disabled={isLoadingClasses}
                className={`text-xs px-3 py-2 rounded font-medium transition-colors ${
                  isLoadingClasses 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <i className={`fas ${isLoadingClasses ? 'fa-spinner fa-spin' : 'fa-sync-alt'} mr-1`}></i>
                {isLoadingClasses ? 'Loading...' : 'Refresh'}
              </button>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="sm:hidden">
                {classes.slice(0, showAllClasses ? classes.length : 4).map((cls, i) => (
                  <motion.div 
                    key={cls.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`p-4 md:p-6 rounded-2xl border bg-white transition-all group ${cls.is_active ? 'border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300' : 'border-orange-200 bg-orange-50/30'} mb-4`}
                  >
                    <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl transition-colors flex items-center justify-center ${cls.is_active ? 'bg-slate-50 group-hover:bg-blue-50' : 'bg-orange-100'}`}>
                      <img src={cls.icon_path} alt={cls.title} className={`w-8 md:w-10 h-8 md:h-10 object-contain ${!cls.is_active ? 'opacity-60' : ''}`} />
                    </div>
                    <h3 className={`text-base md:text-lg font-semibold mb-2 ${cls.is_active ? 'text-slate-900' : 'text-slate-600'}`}>{cls.title}</h3>
                    <p className={`text-xs md:text-sm mb-4 md:mb-6 ${cls.is_active ? 'text-slate-500' : 'text-slate-400'}`}>{cls.schedule_time}</p>
                    {cls.is_active ? (
                      <a href="/daftar" className="block w-full py-2 md:py-3 bg-blue-600 text-white rounded-xl font-medium text-xs md:text-sm hover:bg-blue-700 transition-colors text-center">Pilih Kelas</a>
                    ) : (
                      <div className="w-full py-2 md:py-3 bg-orange-100 text-orange-600 rounded-xl font-medium text-xs md:text-sm text-center border border-orange-200">
                        Tidak Aktif
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Desktop: tampilkan semua */}
              <div className="hidden sm:contents">
                {classes.map((cls, i) => (
                  <motion.div 
                    key={cls.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`p-4 md:p-6 rounded-2xl border bg-white transition-all group ${cls.is_active ? 'border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300' : 'border-orange-200 bg-orange-50/30'}`}
                  >
                    <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl transition-colors flex items-center justify-center ${cls.is_active ? 'bg-slate-50 group-hover:bg-blue-50' : 'bg-orange-100'}`}>
                      <img src={cls.icon_path} alt={cls.title} className={`w-8 md:w-10 h-8 md:h-10 object-contain ${!cls.is_active ? 'opacity-60' : ''}`} />
                    </div>
                    <h3 className={`text-base md:text-lg font-semibold mb-2 ${cls.is_active ? 'text-slate-900' : 'text-slate-600'}`}>{cls.title}</h3>
                    <p className={`text-xs md:text-sm mb-4 md:mb-6 ${cls.is_active ? 'text-slate-500' : 'text-slate-400'}`}>{cls.schedule_time}</p>
                    {cls.is_active ? (
                      <a href="/daftar" className="block w-full py-2 md:py-3 bg-blue-600 text-white rounded-xl font-medium text-xs md:text-sm hover:bg-blue-700 transition-colors text-center">Pilih Kelas</a>
                    ) : (
                      <div className="w-full py-2 md:py-3 bg-orange-100 text-orange-600 rounded-xl font-medium text-xs md:text-sm text-center border border-orange-200">
                        Tidak Aktif
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* See More/Less Button - hanya tampil di mobile */}
            {classes.length > 4 && (
              <div className="mt-8 sm:hidden">
                <button
                  onClick={() => setShowAllClasses(!showAllClasses)}
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {showAllClasses ? (
                    <>
                      See Less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      See More ({classes.length - 4} more) <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* MENTOR */}
        <section id="mentor" className="bg-blue-50 py-12 md:py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 md:mb-12"
            >
              Team & Mentor
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Mobile: tampilkan berdasarkan state, Desktop: tampilkan semua */}
              <div className="sm:hidden">
                {MENTORS_DATA.slice(0, showAllMentors ? MENTORS_DATA.length : 4).map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center group hover:shadow-xl hover:-translate-y-1 transition-all mb-4"
                  >
                    <motion.div 
                      className="mb-3 md:mb-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={m.img} className="w-16 md:w-20 h-16 md:h-20 rounded-full border-2 border-slate-100 group-hover:border-blue-600 transition-colors" alt={m.name} />
                    </motion.div>
                    <h4 className="font-semibold text-slate-900 mb-2 md:mb-3 text-center text-sm md:text-base">{m.name}</h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-3 md:mb-4">
                      {m.tags.slice(0, 2).map(t => <span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">{t}</span>)}
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex gap-2 mt-auto">
                      <a 
                        href={m.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm border border-slate-200"
                      >
                        <InstagramIcon size={12} />
                      </a>
                      <a 
                        href={m.socials.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <GithubIcon size={12} />
                      </a>
                      <a 
                        href={m.socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <LinkedinIcon size={12} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Desktop: tampilkan semua */}
              <div className="hidden sm:contents">
                {MENTORS_DATA.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center group hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <motion.div 
                      className="mb-3 md:mb-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src={m.img} className="w-16 md:w-20 h-16 md:h-20 rounded-full border-2 border-slate-100 group-hover:border-blue-600 transition-colors" alt={m.name} />
                    </motion.div>
                    <h4 className="font-semibold text-slate-900 mb-2 md:mb-3 text-center text-sm md:text-base">{m.name}</h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-3 md:mb-4">
                      {m.tags.map(t => <span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">{t}</span>)}
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex gap-2 mt-auto">
                      <a 
                        href={m.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm border border-slate-200"
                      >
                        <InstagramIcon size={12} />
                      </a>
                      <a 
                        href={m.socials.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <GithubIcon size={12} />
                      </a>
                      <a 
                        href={m.socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 md:w-8 h-7 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <LinkedinIcon size={12} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* See More/Less Button - hanya tampil di mobile */}
            {MENTORS_DATA.length > 4 && (
              <div className="mt-8 sm:hidden">
                <button
                  onClick={() => setShowAllMentors(!showAllMentors)}
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {showAllMentors ? (
                    <>
                      See Less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      See More ({MENTORS_DATA.length - 4} more) <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BLOG */}
        <section id="blog" className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-slate-900 mb-12 text-center"
            >
              Aktivitas KafeKoding
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {blogs.slice(0, 3).map((post, i) => (
                <motion.div 
                  key={post.id}
                  variants={itemVariants}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                >
                  <motion.div 
                    className="relative rounded-xl overflow-hidden mb-4 shadow-sm aspect-video"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={post.img} className="w-full h-full object-cover" alt="Blog" />
                    <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">{post.category}</div>
                  </motion.div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm mb-2">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                          <User size={12} />
                        </div>
                        <span>{post.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-600" /> {post.date}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:gap-3 transition-all mt-auto">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Lihat Semua Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a 
                href="/blog"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Lihat Semua Artikel <ArrowRight size={18} />
              </a>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
});

Home.displayName = 'Home';

export default Home;