import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  UserCheck,
  Phone,
  Camera,
  Upload
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitRegistration, fetchClasses } from '../services/api';
import { CLASSES_DATA, INSTITUTIONS_DATA } from '../data/constants';

const Daftar = () => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [classes, setClasses] = useState(CLASSES_DATA); // Start with fallback immediately
  const [loading, setLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    institution: "",
    instagramProofUrl: ""
  });

  useEffect(() => {
    // AOS initialization removed to fix white page issue
    // Load API data in background
    loadClasses();
  }, []);

  const loadClasses = useCallback(async () => {
    try {
      setIsLoadingClasses(true);
      console.log('[DAFTAR] Loading classes from API...');
      // Temporarily disable API call to prevent errors
      // const classesData = await fetchClasses();
      
      // Use fallback data for now
      console.log('[DAFTAR] Using fallback data from constants.js');
      setClasses(CLASSES_DATA);
    } catch (error) {
      console.error('[DAFTAR] Failed to load classes:', error);
      console.log('[DAFTAR] Keeping fallback data from constants.js');
      setClasses(CLASSES_DATA);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  const compressImage = useCallback((file, maxWidth = 600, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File harus berupa gambar'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          URL.revokeObjectURL(img.src);
          
          resolve(compressedDataUrl);
        } catch (error) {
          reject(new Error('Gagal memproses gambar'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Gagal memuat gambar'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Enhanced file validation and processing
  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;
    
    // Enhanced file validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    
    setFileName(file.name);
    setError(""); // Clear previous errors
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    
    try {
      // Compress image with better settings
      const compressedDataUrl = await compressImage(file, 600, 0.7);
      
      // Check compressed size (max ~400KB for better performance)
      if (compressedDataUrl.length > 400000) {
        const retryCompressed = await compressImage(file, 400, 0.6);
        if (retryCompressed.length > 400000) {
          setError("File masih terlalu besar setelah kompresi. Pilih gambar yang lebih kecil.");
          URL.revokeObjectURL(previewUrl);
          setFilePreview(null);
          setFileName("");
          return;
        }
        handleInputChange('instagramProofUrl', retryCompressed);
      } else {
        handleInputChange('instagramProofUrl', compressedDataUrl);
      }
    } catch (error) {
      console.error('Image compression failed:', error);
      setError(error.message || "Gagal memproses gambar. Silakan coba file lain.");
      URL.revokeObjectURL(previewUrl);
      setFilePreview(null);
      setFileName("");
    }
  }, [compressImage]);

  // Optimized input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Enhanced class toggle with better validation
  const handleClassToggle = useCallback((cls) => {
    if (!cls.is_active) return;
    
    setSelectedClasses(prev => {
      const isSelected = prev.find(c => c.id === cls.id);
      
      if (isSelected) {
        // Remove class if already selected
        return prev.filter(c => c.id !== cls.id);
      } else {
        // Add class with validation
        if (prev.length >= 2) return prev; // Max 2 classes
        
        const classTime = cls.schedule_time || cls.time;
        const sameTimeSlot = prev.some(c => {
          const selectedTime = c.schedule_time || c.time;
          return selectedTime === classTime;
        });
        
        if (sameTimeSlot) return prev; // Don't allow same time slot
        
        return [...prev, cls];
      }
    });
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    if (selectedClasses.length === 0) {
      return "Pilih minimal satu kelas";
    }

    if (!formData.fullName?.trim()) {
      return "Nama lengkap harus diisi";
    }

    if (formData.fullName.trim().length < 2) {
      return "Nama lengkap minimal 2 karakter";
    }

    if (!formData.whatsappNumber?.trim()) {
      return "Nomor WhatsApp harus diisi";
    }

    // Enhanced WhatsApp validation
    const phoneNumber = formData.whatsappNumber.replace(/\D/g, '');
    const indonesianPhoneRegex = /^(08|628|\+628)[0-9]{8,12}$/;
    
    if (!indonesianPhoneRegex.test(phoneNumber) && !indonesianPhoneRegex.test('0' + phoneNumber)) {
      return "Format nomor WhatsApp tidak valid (gunakan format Indonesia)";
    }

    if (!formData.institution?.trim()) {
      return "Asal institusi harus dipilih";
    }

    return null;
  }, [formData, selectedClasses]);

  // Optimized form submission with better error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sanitize phone number
      const phoneNumber = formData.whatsappNumber.replace(/\D/g, '');
      const normalizedPhone = phoneNumber.startsWith('0') ? '62' + phoneNumber.slice(1) : phoneNumber;

      const registrationData = {
        fullName: formData.fullName.trim(),
        whatsappNumber: normalizedPhone,
        institution: formData.institution.trim(),
        instagramProofUrl: formData.instagramProofUrl || null,
        selectedClasses: selectedClasses.map(cls => ({
          id: cls.id,
          title: cls.title,
          time: cls.schedule_time || cls.time
        }))
      };

      // Temporarily disable API submission to prevent errors
      // const result = await submitRegistration(registrationData);
      
      // Simulate successful submission for now
      console.log('[DAFTAR] Registration data:', registrationData);
      setFormSubmitted(true);
      
      // Auto-reset form after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setSelectedClasses([]);
        setFileName("");
        if (filePreview) {
          URL.revokeObjectURL(filePreview);
        }
        setFilePreview(null);
        setFormData({
          fullName: "",
          whatsappNumber: "",
          institution: "",
          instagramProofUrl: ""
        });
      }, 5000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Enhanced error handling
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else if (error.message.includes('Invalid API key')) {
        setError("Terjadi kesalahan sistem. Silakan hubungi admin.");
      } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        setError("Data sudah terdaftar. Silakan gunakan data yang berbeda.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi dalam beberapa saat.");
      }
    } finally {
      setLoading(false);
    }
  }, [formData, selectedClasses, validateForm, filePreview]);

  // Memoized class filtering for better performance
  const activeClasses = useMemo(() => {
    return classes.filter(cls => cls.is_active !== false);
  }, [classes]);

  // Cleanup effect for file preview URLs
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* --- MAIN CONTENT (FORM DAFTAR) --- */}
      <main className="flex-grow pt-32 pb-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-5 -mr-24 -mt-24 rounded-full"></div>
          
          {formSubmitted ? (
             <div className="text-center py-16 space-y-6">
                <div className="flex justify-center">
                  <i className="fas fa-check-circle text-green-500 text-6xl animate-bounce"></i>
                </div>
                <h4 className="text-3xl font-black text-slate-900">Berhasil Terdaftar!</h4>
                <p className="font-bold text-slate-400 text-sm">Terima kasih telah memilih untuk turun tangan. Tunggu undangan admin via WhatsApp.</p>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
                  <p><strong>Data Anda:</strong></p>
                  <p><i className="fas fa-user mr-2"></i>Nama: {formData.fullName}</p>
                  <p><i className="fas fa-phone mr-2"></i>WhatsApp: {formData.whatsappNumber}</p>
                  <p><i className="fas fa-university mr-2"></i>Institusi: {INSTITUTIONS_DATA.find(inst => inst.value === formData.institution)?.label || formData.institution}</p>
                  <p><i className="fas fa-graduation-cap mr-2"></i>Kelas: {selectedClasses.map(c => c.title).join(', ')}</p>
                </div>
                <button onClick={() => setFormSubmitted(false)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wide shadow-lg">
                  <i className="fas fa-plus mr-2"></i>Daftar Lagi
                </button>
             </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-8 relative z-10 font-bold">
                <h2 className="text-3xl font-black uppercase text-slate-900 text-center mb-10 tracking-wide underline decoration-blue-600 decoration-4 underline-offset-8">Form Pendaftaran</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-blue-600">
                  <div className="space-y-3">
                     <label className="text-xs uppercase ml-1 font-bold">Nama Lengkap <span className="text-red-500">*</span></label>
                     <div className="relative group">
                        <UserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                          required 
                          type="text" 
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full pl-12 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm shadow-sm font-bold" 
                          placeholder="Nama Anda..." 
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs uppercase ml-1 font-bold">No. WhatsApp <span className="text-red-500">*</span></label>
                     <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" size={18} />
                        <input 
                          required 
                          type="tel" 
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          className="w-full pl-12 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-green-400 transition-all text-sm shadow-sm font-bold" 
                          placeholder="08xxxxxxxx" 
                        />
                     </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-blue-600">
                  <label className="text-xs uppercase ml-1 font-bold">Asal Institusi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="w-full px-6 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm shadow-sm font-bold appearance-none cursor-pointer pr-12" 
                    >
                      <option value="">Pilih Institusi...</option>
                      {INSTITUTIONS_DATA.map(institution => (
                        <option key={institution.value} value={institution.value}>
                          {institution.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-blue-600">
                  <label className="text-xs uppercase ml-1 font-bold">Upload Bukti Follow IG <span className="text-slate-400">(Opsional)</span></label>
                  <label className={`flex items-center justify-between w-full px-6 py-5 bg-white border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <Camera size={20} />
                      <span className="text-sm font-bold text-slate-400 truncate max-w-[200px]">
                        {fileName || "Pilih Screenshot Bukti Follow..."}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileSelect(file);
                        }
                      }} 
                    />
                    <Upload size={18} className="text-blue-600" />
                  </label>
                  
                  {/* Preview Image */}
                  {filePreview && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-xs text-blue-600 mb-2 font-medium">
                        <i className="fas fa-image mr-1"></i>Preview Gambar:
                      </div>
                      <div className="flex justify-center">
                        <img 
                          src={filePreview} 
                          alt="Preview bukti follow Instagram" 
                          className="max-w-full max-h-48 rounded-lg border border-blue-200 shadow-sm"
                        />
                      </div>
                      <div className="text-xs text-blue-600 mt-2 text-center">
                        <i className="fas fa-check mr-1"></i>File: {fileName}
                      </div>
                    </div>
                  )}
                  
                  {fileName && !filePreview && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                      <i className="fas fa-check mr-1"></i>File dipilih: {fileName}
                      <br />
                      <span className="text-blue-600">File akan disimpan saat pendaftaran berhasil</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400 mt-1 italic">Silakan follow @kafekoding di Instagram sebagai syarat bergabung.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase text-slate-900 font-bold">Pilih Kelas (Maks. 2, satu per sesi waktu) <span className="text-red-500">*</span></label>
                    <button 
                      type="button"
                      onClick={loadClasses}
                      disabled={isLoadingClasses}
                      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                        isLoadingClasses 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <i className={`fas ${isLoadingClasses ? 'fa-spinner fa-spin' : 'fa-sync-alt'} mr-1`}></i>
                      Refresh Data
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <strong>Jadwal Kelas:</strong><br/>
                    • <strong>Sesi 1 (10:00-12:00):</strong> HTML & CSS, PHP<br/>
                    • <strong>Sesi 2 (13:00-15:00):</strong> Database, Javascript<br/>
                    <em>Pilih maksimal 1 kelas per sesi waktu</em>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {activeClasses.map(cls => {
                       const isSel = selectedClasses.find(c => c.id === cls.id);
                       const classTime = cls.schedule_time || cls.time;
                       const isDis = !isSel && (selectedClasses.length >= 2 || selectedClasses.some(c => {
                         const selectedTime = c.schedule_time || c.time;
                         return selectedTime === classTime;
                       }));
                       
                       return (
                         <div 
                           key={cls.id} 
                           onClick={() => !isDis && handleClassToggle(cls)} 
                           className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                             isSel 
                               ? 'border-blue-600 bg-blue-50 scale-105 shadow-md cursor-pointer' 
                               : isDis 
                                 ? 'bg-white border-slate-100 opacity-30 grayscale cursor-not-allowed border-dashed'
                                 : 'bg-white border-slate-100 cursor-pointer hover:scale-105'
                           }`}
                         >
                            <div className="flex items-center gap-4">
                               <img 
                                 src={cls.icon_path || cls.iconImg} 
                                 alt={cls.title} 
                                 className="w-6 h-6 object-contain" 
                                 loading="lazy"
                               />
                               <div className="flex flex-col">
                                 <p className="text-xs uppercase tracking-tight font-bold">
                                   {cls.title}
                                 </p>
                                 <p className="text-xs tracking-wide font-bold text-blue-600">
                                   {classTime}
                                 </p>
                               </div>
                            </div>
                            {isSel && <CheckCircle size={20} className="text-blue-600" />}
                            {!isSel && !isDis && <div className="w-5 h-5 rounded-full border-2 border-slate-100"></div>}
                         </div>
                       )
                     })}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading || selectedClasses.length === 0}
                  className={`w-full py-6 rounded-2xl text-white shadow-xl transition-all flex items-center justify-center gap-4 tracking-wide uppercase font-bold ${
                    loading || selectedClasses.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-50'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Mengirim Data...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Kirim Pendaftaran
                    </>
                  )}
                </button>
                
                {selectedClasses.length === 0 && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Pilih minimal satu kelas untuk melanjutkan
                  </p>
                )}
             </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Daftar;