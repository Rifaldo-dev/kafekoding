import { useState, useEffect, memo, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronRight,
  Calendar, 
  ChevronUp
} from 'lucide-react';
import { ASSETS, STATS_DATA, CLASSES_DATA, MENTORS_DATA, BLOG_DATA } from './data/constants';
import { fetchClasses } from './services/api';
import { InstagramIcon, GithubIcon, LinkedinIcon } from './components/Icons';
import { useScrollToTop } from './hooks/useScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const PhotoStack = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const photos = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400",
      alt: "Workshop Coding",
      title: "Workshop Coding"
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400", 
      alt: "Diskusi Tim",
      title: "Diskusi Tim"
    },
    {
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=400",
      alt: "Presentasi Project", 
      title: "Presentasi Project"
    },
    {
      src: "https://images.unsplash.com/photo-1515378791036-0648a814c963?auto=format&fit=crop&q=80&w=400",
      alt: "Coding Session",
      title: "Coding Session"
    },
    {
      src: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=400",
      alt: "Learning Together",
      title: "Learning Together"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [photos.length]);

  const handlePhotoClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const getPhotoStyle = useCallback((index) => {
    const diff = (index - currentIndex + photos.length) % photos.length;
    
    if (diff === 0) {
      return {
        zIndex: 30,
        transform: 'rotate(2deg) translateY(0px)',
        opacity: 1,
        scale: 1
      };
    } else if (diff === 1) {
      return {
        zIndex: 20,
        transform: 'rotate(-3deg) translateY(8px) translateX(-8px)',
        opacity: 0.8,
        scale: 0.95
      };
    } else if (diff === 2) {
      return {
        zIndex: 10,
        transform: 'rotate(6deg) translateY(16px) translateX(-16px)',
        opacity: 0.6,
        scale: 0.9
      };
    } else {
      return {
        zIndex: 0,
        transform: 'rotate(0deg) translateY(24px) translateX(-24px)',
        opacity: 0,
        scale: 0.85
      };
    }
  }, [currentIndex, photos.length]);

  return (
    <div className="relative">
      <div className="relative w-80 h-64">
        {photos.map((photo, index) => {
          const style = getPhotoStyle(index);
          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-64 h-48 bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white cursor-pointer transition-all duration-500 ease-out hover:scale-105"
              style={{
                zIndex: style.zIndex,
                transform: style.transform,
                opacity: style.opacity,
                scale: style.scale
              }}
              onClick={() => handlePhotoClick(index)}
            >
              <img 
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium">{photo.title}</p>
              </div>
            </div>
          );
        })}
        
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-40">
          <span className="text-sm font-semibold">500+ Members</span>
        </div>
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              onClick={() => handlePhotoClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

PhotoStack.displayName = 'PhotoStack';

const Home = memo(() => {
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [showAllMentors, setShowAllMentors] = useState(false);
  const [classes, setClasses] = useState(CLASSES_DATA); // Start with fallback data immediately
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const { showBackToTop, scrollToTop } = useScrollToTop();

  useEffect(() => {
    // AOS initialization removed to fix white page issue
    
    // Load API data in background
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setIsLoadingClasses(true);
      console.log('[HOME] Loading classes from API...');
      // Temporarily disable API call to prevent errors
      // const classesData = await fetchClasses();
      
      // Use fallback data for now
      console.log('[HOME] Using fallback data from constants.js');
      setClasses(CLASSES_DATA);
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
          
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="hero-title-highlight">Kafekoding</span>
            </h1>
            
            <p className="hero-description">
              Selamat datang di Website Resmi. Media informasi, koordinasi, dan aspirasi seluruh anggota KafeKoding Community.
            </p>
            
            <div className="hero-buttons">
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
          </div>
        </section>

        <section className="bg-blue-600 py-12 text-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS_DATA.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="tentang" className="bg-blue-50 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tentang Kami</h2>
              <p className="text-lg text-blue-600 mb-6 font-medium">"Kami Memilih Turun Tangan"</p>
              
              <div className="lg:hidden mb-8 flex justify-center">
                <img src={ASSETS.ABOUT_IMAGE} className="rounded-xl shadow-lg h-48 w-full max-w-sm object-cover" alt="Dokumentasi KafeKoding" />
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed mb-8">
                <p>Komunitas Kafe Koding merupakan wadah belajar dan berbagi di bidang teknologi informasi yang berfokus pada pengembangan kemampuan anggota secara individu maupun tim sesuai kebutuhan industri. Dengan semangat kolaborasi, komunitas ini menyediakan lingkungan yang aktif, sehat, dan produktif bagi mahasiswa maupun masyarakat umum untuk berdiskusi, berlatih, serta mengembangkan keterampilan di dunia IT.</p>
                <p>Kafe Koding juga berkomitmen untuk membangun hubungan yang kuat dengan kampus dan komunitas teknologi lainnya, serta menciptakan ekosistem pembelajaran yang inklusif melalui kegiatan belajar bersama, proyek kolaboratif, dan pengembangan media informasi. Dengan demikian, komunitas ini diharapkan mampu menghasilkan anggota yang kompeten, profesional, serta berkontribusi aktif dalam perkembangan teknologi, khususnya di Sumatera Barat.</p>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 grid grid-cols-1 gap-4">
              <img src={ASSETS.ABOUT_IMAGE} className="rounded-xl shadow-lg h-64 object-cover w-full" alt="Dokumentasi KafeKoding" />
            </div>
          </div>
        </section>

        <section id="kelas" className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mx-auto">Pilihan Kelas</h2>
              <button 
                onClick={loadClasses}
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sm:hidden">
                {classes.slice(0, showAllClasses ? classes.length : 4).map((cls, i) => (
                  <div key={cls.id} className={`p-6 rounded-2xl border bg-white transition-all group ${cls.is_active ? 'border-slate-200 hover:shadow-lg hover:border-blue-200' : 'border-orange-200 bg-orange-50/30'} mb-6`}>
                    <div className={`mb-6 p-4 rounded-xl transition-colors flex items-center justify-center ${cls.is_active ? 'bg-slate-50 group-hover:bg-blue-50' : 'bg-orange-100'}`}>
                      <img src={cls.icon_path} alt={cls.title} className={`w-10 h-10 object-contain ${!cls.is_active ? 'opacity-60' : ''}`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${cls.is_active ? 'text-slate-900' : 'text-slate-600'}`}>{cls.title}</h3>
                    <p className={`text-sm mb-6 ${cls.is_active ? 'text-slate-500' : 'text-slate-400'}`}>{cls.schedule_time}</p>
                    {cls.is_active ? (
                      <a href="/daftar" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors text-center">Pilih Kelas</a>
                    ) : (
                      <div className="w-full py-3 bg-orange-100 text-orange-600 rounded-xl font-medium text-sm text-center border border-orange-200">
                        Kelas Sedang Tidak Aktif
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Desktop: tampilkan semua */}
              <div className="hidden sm:contents">
                {classes.map((cls, i) => (
                  <div key={cls.id} className={`p-6 rounded-2xl border bg-white transition-all group ${cls.is_active ? 'border-slate-200 hover:shadow-lg hover:border-blue-200' : 'border-orange-200 bg-orange-50/30'}`}>
                    <div className={`mb-6 p-4 rounded-xl transition-colors flex items-center justify-center ${cls.is_active ? 'bg-slate-50 group-hover:bg-blue-50' : 'bg-orange-100'}`}>
                      <img src={cls.icon_path} alt={cls.title} className={`w-10 h-10 object-contain ${!cls.is_active ? 'opacity-60' : ''}`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${cls.is_active ? 'text-slate-900' : 'text-slate-600'}`}>{cls.title}</h3>
                    <p className={`text-sm mb-6 ${cls.is_active ? 'text-slate-500' : 'text-slate-400'}`}>{cls.schedule_time}</p>
                    {cls.is_active ? (
                      <a href="/daftar" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors text-center">Pilih Kelas</a>
                    ) : (
                      <div className="w-full py-3 bg-orange-100 text-orange-600 rounded-xl font-medium text-sm text-center border border-orange-200">
                        Kelas Sedang Tidak Aktif
                      </div>
                    )}
                  </div>
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
        <section id="mentor" className="bg-blue-50 py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Team & Mentor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Mobile: tampilkan berdasarkan state, Desktop: tampilkan semua */}
              <div className="sm:hidden">
                {MENTORS_DATA.slice(0, showAllMentors ? MENTORS_DATA.length : 4).map((m, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center group hover:shadow-md transition-all mb-6">
                    <div className="mb-4">
                      <img src={m.img} className="w-20 h-20 rounded-full border-2 border-slate-100" alt={m.name} />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-center">{m.name}</h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {m.tags.map(t => <span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">{t}</span>)}
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex gap-2 mt-auto">
                      <a 
                        href={m.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm border border-slate-200"
                      >
                        <InstagramIcon size={14} />
                      </a>
                      <a 
                        href={m.socials.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <GithubIcon size={14} />
                      </a>
                      <a 
                        href={m.socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <LinkedinIcon size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop: tampilkan semua */}
              <div className="hidden sm:contents">
                {MENTORS_DATA.map((m, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center group hover:shadow-md transition-all">
                    <div className="mb-4">
                      <img src={m.img} className="w-20 h-20 rounded-full border-2 border-slate-100" alt={m.name} />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-3 text-center">{m.name}</h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {m.tags.map(t => <span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">{t}</span>)}
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex gap-2 mt-auto">
                      <a 
                        href={m.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm border border-slate-200"
                      >
                        <InstagramIcon size={14} />
                      </a>
                      <a 
                        href={m.socials.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <GithubIcon size={14} />
                      </a>
                      <a 
                        href={m.socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      >
                        <LinkedinIcon size={14} />
                      </a>
                    </div>
                  </div>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Aktivitas KafeKoding</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_DATA.map((post, i) => (
                <div key={post.id} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm aspect-video">
                    <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Blog" />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-lg">{post.category}</div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Calendar size={14} className="text-blue-600" /> {post.date}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <button className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:gap-3 transition-all">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Lihat Semua Button */}
            <div className="text-center mt-12">
              <a 
                href="/blog"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Lihat Semua Artikel <ArrowRight size={18} />
              </a>
            </div>
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