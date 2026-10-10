'use client';
import { useState, useEffect } from 'react';
import { 
  Send, Sparkles, Copy, Trash2, Download, 
  CheckCircle2, ExternalLink, HelpCircle, Key, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [linkOrCode, setLinkOrCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sessionIdentifier, setSessionIdentifier] = useState('am_sess_' + Math.random().toString(36).substring(2, 15));
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    { time: '13.06.40', type: 'SYSTEM', text: 'Sistem Verifikasi Alight Motion (am-reverse core) siap digunakan.' },
    { time: '13.06.41', type: 'READY', text: 'Silakan masukkan alamat email akun Alight Motion Anda lalu klik "Kirim Link".' }
  ]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 142, today: 18 });
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('am_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  const addLog = (type, text) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    setLogs(prev => [...prev, { time, type, text }]);
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Masukkan email terlebih dahulu!');
      return;
    }
    setLoading(true);
    addLog('INFO', `Mengirim magic link ke: ${email}...`);

    try {
      const res = await fetch('/api/am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-link', email })
      });
      const data = await res.json();
      
      if (data.ok) {
        addLog('SUCCESS', `Magic link berhasil dikirim ke ${email}. Cek inbox/spam.`);
        setStep(2);
      } else {
        addLog('ERROR', `Gagal mengirim link: ${data.why}`);
        alert(`Gagal: ${data.why}`);
      }
    } catch (err) {
      addLog('ERROR', `Koneksi error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !linkOrCode) {
      alert('Email dan Link/Kode verifikasi wajib diisi!');
      return;
    }
    setLoading(true);
    addLog('INFO', 'Melakukan verifikasi token & aktivasi VIP Pro...');

    try {
      const res = await fetch('/api/am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-and-upgrade', email, linkOrCode })
      });
      const data = await res.json();

      if (data.ok) {
        addLog('SUCCESS', `Akun ${email} berhasil dipremiumkan (Order: ${data.orderId})!`);
        setSuccessData(data);
        setStep(3);

        const newHistory = [{ email, uid: data.uid, orderId: data.orderId, date: new Date().toLocaleString() }, ...history];
        setHistory(newHistory);
        localStorage.setItem('am_history', JSON.stringify(newHistory));
        setStats(prev => ({ total: prev.total + 1, today: prev.today + 1 }));
      } else {
        addLog('ERROR', `Verifikasi gagal: ${data.why}`);
        alert(`Gagal: ${data.why}`);
      }
    } catch (err) {
      addLog('ERROR', `Error sistem: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Hapus semua riwayat?')) {
      setHistory([]);
      localStorage.removeItem('am_history');
      addLog('SYSTEM', 'Riwayat berhasil dibersihkan.');
    }
  };

  const downloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "am_verified_accounts.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-12 font-mono">
      <div className="bg-[#FFDE59] neo-box p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFDE59] flex items-center justify-center font-bold neo-box">AM</div>
            <div>
              <h1 className="text-lg font-black tracking-wider flex items-center gap-2">
                AM PREM VERIFIER <span className="bg-cyan-300 text-black text-xs px-1.5 py-0.5 border border-black">V2.0</span>
              </h1>
              <p className="text-xs">Layanan Otomatisasi Pengiriman Magic Link & Verifikasi Akun</p>
            </div>
          </div>
        </div>
        <a 
          href="https://whatsapp.com" 
          target="_blank" 
          rel="noreferrer"
          className="mt-3 w-full bg-[#00FF66] text-black font-bold py-2 px-3 neo-box flex items-center justify-center gap-2 text-sm"
        >
          Saluran WhatsApp <ExternalLink size={16}/>
        </a>
      </div>

      <div className="bg-[#FFDE59] neo-box p-5 mb-6 relative">
        <div className="absolute -top-3 left-4 bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest border border-black">
          ✦ Layanan Verifikasi Akun Berbasis Web
        </div>
        <h2 className="text-xl font-black mt-2 mb-2 leading-tight">AM PREM MAGIC LINK TOOL</h2>
        <p className="text-xs mb-4 leading-relaxed">
          Otomatis perolehan session cookie, pengiriman magic link ke email, dan verifikasi akun Alight Motion secara cepat dan aman.
        </p>
        <div className="flex flex-col gap-2">
          <div className="bg-white border-2 border-black p-2 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <Sparkles className="text-amber-500" size={16}/> Auto 1-Year VIP Pro
          </div>
          <div className="bg-[#B9FF66] border-2 border-black p-2 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <Key size={16}/> AM-Reverse Engine
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white neo-box p-4">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Total Aktivasi</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white neo-box p-4 flex flex-col justify-between">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Aktivasi Hari Ini</div>
          <div className="text-2xl font-black mt-1 flex items-center justify-between">
            {stats.today}
            <Sparkles className="text-amber-400" size={20}/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className={`p-2 text-center text-xs font-bold neo-box ${step === 1 ? 'bg-black text-yellow-300' : 'bg-white'}`}>
          LANGKAH 1<br/><span className="text-[10px]">01 Email</span>
        </div>
        <div className={`p-2 text-center text-xs font-bold neo-box ${step === 2 ? 'bg-black text-yellow-300' : 'bg-white'}`}>
          LANGKAH 2<br/><span className="text-[10px]">02 Link</span>
        </div>
        <div className={`p-2 text-center text-xs font-bold neo-box ${step === 3 ? 'bg-black text-yellow-300' : 'bg-white'}`}>
          LANGKAH 3<br/><span className="text-[10px]">03 VIP Pro</span>
        </div>
      </div>

      <div className="bg-white neo-box p-5 mb-6">
        <div className="bg-[#B9FF66] text-black text-xs font-black inline-block px-2 py-1 mb-3 border-2 border-black">
          STEP 0{step}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendLink}>
            <h3 className="text-base font-black mb-1">MASUKKAN EMAIL AKUN ALIGHT MOTION</h3>
            <p className="text-xs text-gray-600 mb-4">Link verifikasi instan akan dikirim langsung ke alamat email Anda tanpa perlu kata sandi.</p>
            
            <label className="block text-xs font-bold mb-1">ALAMAT EMAIL TARGET *</label>
            <input 
              type="email" 
              required
              placeholder="nama@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 neo-input text-sm mb-3 bg-white"
            />
            <p className="text-[10px] text-gray-500 mb-4">Pastikan email aktif dan dapat menerima email dari Alight Motion.</p>

            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-blue-600 underline flex items-center gap-1 mb-3"
            >
              {showAdvanced ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} 
              {showAdvanced ? 'Sembunyikan Opsi Sesi Lanjutan' : 'Tampilkan Opsi Sesi Lanjutan'}
            </button>

            {showAdvanced && (
              <div className="bg-gray-100 p-3 border-2 border-black mb-4">
                <label className="block text-[10px] font-bold mb-1">SESSION IDENTIFIER (OPSIONAL)</label>
                <input 
                  type="text" 
                  value={sessionIdentifier}
                  onChange={e => setSessionIdentifier(e.target.value)}
                  className="w-full p-1.5 neo-input text-xs bg-white mb-1"
                />
                <p className="text-[9px] text-gray-500">Sistem kini menggunakan identitytoolkit Android resmi dengan spoofing IP acak secara otomatis.</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#B9FF66] text-black font-black py-3 neo-box flex items-center justify-center gap-2 text-sm hover:bg-[#a3e635]"
            >
              {loading ? 'MEMPROSES...' : <>KIRIM MAGIC LINK KE EMAIL <Send size={16}/></>}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <h3 className="text-base font-black mb-1">MASUKKAN LINK / KODE VERIFIKASI</h3>
            <p className="text-xs text-gray-600 mb-4">Salin tautan dari tombol "Sign In / Verify" di email Alight Motion Anda lalu tempel di bawah ini.</p>
            
            <label className="block text-xs font-bold mb-1">TARGET EMAIL: <span className="text-indigo-600">{email}</span></label>
            <textarea 
              required
              rows={4}
              placeholder="Tempel link verifikasi lengkap atau oobCode di sini..."
              value={linkOrCode}
              onChange={e => setLinkOrCode(e.target.value)}
              className="w-full p-2.5 neo-input text-xs mb-4 bg-white"
            />

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 text-black font-bold py-2.5 neo-box text-xs"
              >
                ← Kembali
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="w-2/3 bg-[#22D3EE] text-black font-black py-2.5 neo-box flex items-center justify-center gap-2 text-xs"
              >
                {loading ? 'MEMVERIFIKASI...' : <>VERIFIKASI & PRO <Sparkles size={14}/></>}
              </button>
            </div>
          </form>
        )}

        {step === 3 && successData && (
          <div className="text-center py-2">
            <div className="w-12 h-12 bg-[#B9FF66] border-2 border-black mx-auto flex items-center justify-center mb-3 shadow-[3px_3px_0px_#000]">
              <CheckCircle2 className="text-black" size={28}/>
            </div>
            <h3 className="text-lg font-black text-emerald-600 mb-1">PREMIUM SUCCESS!</h3>
            <p className="text-xs mb-4">Akun Alight Motion Anda telah berhasil diaktifkan ke paket VIP Pro 1 Tahun secara otomatis.</p>
            
            <div className="bg-gray-50 border-2 border-black p-3 text-left text-xs mb-4 space-y-1">
              <div><b>Email:</b> {successData.email}</div>
              <div><b>UID:</b> {successData.uid}</div>
              <div><b>Order ID:</b> {successData.orderId}</div>
              <div><b>Status:</b> Active (1 Tahun)</div>
            </div>

            <button 
              onClick={() => { setStep(1); setEmail(''); setLinkOrCode(''); setSuccessData(null); }}
              className="w-full bg-[#FFDE59] text-black font-black py-2.5 neo-box text-xs"
            >
              PROSES AKUN LAIN ↺
            </button>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white neo-box p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase flex items-center gap-1">
              Riwayat Akun Terverifikasi ({history.length})
            </h4>
            <div className="flex gap-2">
              <button onClick={downloadBackup} className="bg-[#FFDE59] p-1 border-2 border-black text-xs font-bold flex items-center gap-1">
                <Download size={12}/> JSON
              </button>
              <button onClick={clearHistory} className="bg-rose-300 p-1 border-2 border-black text-xs font-bold">
                <Trash2 size={12}/>
              </button>
            </div>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-2 text-xs">
            {history.map((h, i) => (
              <div key={i} className="bg-gray-50 p-2 border border-black flex justify-between items-center">
                <span className="truncate max-w-[180px] font-bold">{h.email}</span>
                <span className="text-[10px] text-gray-500">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black text-green-400 neo-box p-3 mb-6 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-black"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black"></div>
            <span className="text-gray-400 text-[10px] ml-2">_ amv2_terminal.log</span>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(logs.map(l => `[${l.type}] ${l.text}`).join('\n'))}
            className="text-[10px] bg-gray-800 text-white px-2 py-0.5 border border-gray-600 flex items-center gap-1"
          >
            <Copy size={10}/> Salin
          </button>
        </div>
        <div className="space-y-1 max-h-36 overflow-y-auto text-[11px]">
          {logs.map((log, index) => (
            <div key={index} className="leading-tight">
              <span className="text-gray-500">[{log.time}]</span>{' '}
              <span className={log.type === 'SUCCESS' ? 'text-emerald-400 font-bold' : log.type === 'ERROR' ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                [{log.type}]
              </span>{' '}
              <span>{log.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white neo-box p-5 mb-6">
        <h4 className="font-black text-sm mb-3 flex items-center gap-2">
          <HelpCircle size={16}/> PANDUAN PENGGUNAAN SISTEM
        </h4>
        <div className="space-y-3 text-xs">
          <div className="border-2 border-black p-2.5 bg-gray-50">
            <div className="font-black mb-0.5">1. MASUKKAN EMAIL</div>
            <p className="text-[11px] text-gray-600">Ketikkan email Alight Motion Anda. Sistem memicu pengiriman magic link resmi melalui IdentityToolkit Android.</p>
          </div>
          <div className="border-2 border-black p-2.5 bg-gray-50">
            <div className="font-black mb-0.5">2. SALIN DARI EMAIL</div>
            <p className="text-[11px] text-gray-600">Buka pesan masuk dari Alight Motion di inbox / spam. Salin tautan tombol "Sign In / Verify".</p>
          </div>
          <div className="border-2 border-black p-2.5 bg-gray-50">
            <div className="font-black mb-0.5">3. AKTIVASI OTOMATIS</div>
            <p className="text-[11px] text-gray-600">Tempel link dan klik verifikasi. Sistem otomatis login dan mengaktifkan lisensi VIP Pro 1 Tahun.</p>
          </div>
        </div>
        <div className="mt-4 bg-black text-[#B9FF66] font-bold text-center p-2 text-xs border-2 border-black">
          SISTEM VERIFIKASI AKUN ALIGHT MOTION - AMAN & OTOMATIS
        </div>
      </div>

      <div className="text-center text-xs space-y-2">
        <p className="font-bold">AM PREM VERIFIER - SISTEM VERIFIKASI AKUN BERBASIS NEXT.JS APP ROUTER.</p>
        <div className="inline-block bg-[#FFDE59] border-2 border-black px-3 py-1 font-black shadow-[2px_2px_0px_#000]">
          POWER BY SANN404 FORUM GROUP
        </div>
        <div>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="underline font-bold text-blue-600 text-xs">
            SALURAN WHATSAPP RESMI
          </a>
        </div>
      </div>
    </div>
  );
}
