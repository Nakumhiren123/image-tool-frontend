// src/components/controls/ConvertOptions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Check, Film, ArrowRight } from 'lucide-react';
import { FORMAT_COLORS } from '../../config/converters';

const FORMATS = [
  { id: 'png', label: 'PNG', desc: 'Lossless' },
  { id: 'jpg', label: 'JPG', desc: 'Popular' },
  { id: 'jpeg', label: 'JPEG', desc: 'Standard' },
  { id: 'webp', label: 'WEBP', desc: 'Modern' },
  { id: 'avif', label: 'AVIF', desc: 'Next-Gen' },
  { id: 'gif', label: 'GIF', desc: '🎬 Animated', isGif: true },
  { id: 'bmp', label: 'BMP', desc: 'Raw' },
  // { id: 'heic', label: 'HEIC', desc: 'iPhone' },
  { id: 'ico', label: 'ICO', desc: 'Favicon' },
  { id: 'pdf', label: 'PDF', desc: 'Document' },
  { id: 'docx', label: 'DOCX', desc: 'Word Doc' },
];

export default function ConvertOptions({
  format,       // current target format (e.g. 'png')
  setFormat,    // local state setter (used when no `from` prop)
  quality,
  setQuality,
  from,         // source format from route (e.g. 'jpg') — passed from ConverterPage
}) {
  const navigate = useNavigate();
  const showQuality = ['jpg', 'jpeg', 'webp', 'avif', 'pdf', 'docx'].includes(format);
  const fromColors = FORMAT_COLORS[from] || { bg: '#EDE9FE', color: '#7C3AED' };

  const handleFormatChange = (newFormat) => {
    if (from) {
      // ── Route-based converter: redirect to new slug ──
      // e.g. on /jpg-to-png, user picks WEBP → navigate to /jpg-to-webp
      navigate(`/${from}-to-${newFormat}`);
    } else {
      // ── Generic /convert page: just update local state ──
      setFormat(newFormat);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Section header */}
      <div className="section-title">
        <Layers size={14} color="var(--primary-light)" />
        Convert To Format
      </div>

      {/* FROM pill — only show when on a specific route like /jpg-to-png */}
      {from && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 12,
          background: fromColors.bg,
          border: `1.5px solid ${fromColors.color}33`,
        }}>
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: fromColors.color, color: '#fff',
            fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: '0.78rem',
          }}>
            {from.toUpperCase()}
          </span>
          <ArrowRight size={13} color={fromColors.color} />
          <span style={{ fontSize: '0.78rem', color: fromColors.color, fontWeight: 700 }}>
            Pick target format below
          </span>
        </div>
      )}

      {/* Format grid — always shown, clicking redirects on route pages */}
      <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {FORMATS.map((f) => {
          const isSelected = format === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleFormatChange(f.id)}
              className={`option-card${isSelected ? ' selected' : ''}`}
              style={{
                position: 'relative',
                background: f.isGif ? (isSelected ? '#F5F3FF' : '#FAF5FF') : undefined,
                borderColor: f.isGif ? (isSelected ? '#8B5CF6' : '#E9D5FF') : undefined,
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 18, height: 18, borderRadius: '50%',
                  background: f.isGif ? '#8B5CF6' : 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {f.isGif && <Film size={14} color="#8B5CF6" />}
                <p style={{
                  fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.95rem',
                  color: f.isGif ? '#7C3AED' : (isSelected ? 'var(--primary-light)' : 'var(--text-1)'),
                  margin: 0,
                }}>
                  {f.label}
                </p>
              </div>
              <p style={{
                fontSize: '0.7rem',
                color: f.isGif ? '#8B5CF6' : 'var(--text-3)',
                marginTop: 3,
                fontWeight: f.isGif ? 700 : 500,
              }}>
                {f.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quality slider */}
      {showQuality && (
        <div style={{
          padding: '16px', background: '#F1F5F9',
          border: '1px solid var(--border)', borderRadius: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="label">Export Quality</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-light)' }}>
              {Math.round(quality * 100)}%
            </span>
          </div>
          <input
            type="range" min="0.1" max="1.0" step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.7rem', color: 'var(--text-3)' }}>
            <span>Smaller file</span>
            <span>Best quality</span>
          </div>
        </div>
      )}
    </div>
  );
}

// import React from 'react';
// import { Layers, Check, Film } from 'lucide-react';

// const FORMATS = [
//   { id: 'png',  label: 'PNG',      desc: 'Lossless' },
//   { id: 'jpg',  label: 'JPG',      desc: 'Popular'  },
//   { id: 'jpeg', label: 'JPEG',     desc: 'Standard' },
//   { id: 'webp', label: 'WEBP',     desc: 'Modern'   },
//   { id: 'heic', label: 'HEIC',     desc: 'iPhone'   },
//   { id: 'ico',  label: 'ICO',      desc: 'Favicon'  },
//   { id: 'pdf',  label: 'PDF',      desc: 'Document' },
//   { id: 'docx', label: 'DOCX',     desc: 'Word Doc' },
//   { id: 'gif',  label: 'GIF',      desc: '🎬 Animated', isGif: true },
//   { id: 'avif', label: 'AVIF',     desc: 'Next-Gen' },
//   { id: 'bmp',  label: 'BMP',      desc: 'Raw'      },
// ];

// export default function ConvertOptions({
//   format, setFormat,
//   quality, setQuality,
// }) {
//   const showQuality = ['jpg', 'jpeg', 'webp', 'avif', 'pdf', 'docx'].includes(format);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//       {/* Section header */}
//       <div className="section-title">
//         <Layers size={14} color="var(--primary-light)" />
//         Target Output Format
//       </div>

//       {/* Format grid */}
//       <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
//         {FORMATS.map((f) => {
//           const isSelected = format === f.id;
//           return (
//             <button
//               key={f.id}
//               onClick={() => setFormat(f.id)}
//               className={`option-card${isSelected ? ' selected' : ''}`}
//               style={{
//                 position: 'relative',
//                 background: f.isGif ? (isSelected ? '#F5F3FF' : '#FAF5FF') : undefined,
//                 borderColor: f.isGif ? (isSelected ? '#8B5CF6' : '#E9D5FF') : undefined,
//               }}
//             >
//               {isSelected && (
//                 <div style={{
//                   position: 'absolute', top: 8, right: 8,
//                   width: 18, height: 18, borderRadius: '50%',
//                   background: f.isGif ? '#8B5CF6' : 'var(--primary)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>
//                   <Check size={10} color="#fff" strokeWidth={3} />
//                 </div>
//               )}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                 {f.isGif && <Film size={14} color="#8B5CF6" />}
//                 <p style={{
//                   fontFamily: 'var(--font-head)',
//                   fontWeight: 800,
//                   fontSize: '0.95rem',
//                   color: f.isGif ? '#7C3AED' : (isSelected ? 'var(--primary-light)' : 'var(--text-1)'),
//                   margin: 0,
//                 }}>{f.label}</p>
//               </div>
//               <p style={{
//                 fontSize: '0.7rem',
//                 color: f.isGif ? '#8B5CF6' : 'var(--text-3)',
//                 marginTop: 3,
//                 fontWeight: f.isGif ? 700 : 500,
//               }}>
//                 {f.desc}
//               </p>
//             </button>
//           );
//         })}
//       </div>

//       {/* Quality slider (only for lossy / doc types) */}
//       {showQuality && (
//         <div style={{
//           padding: '16px',
//           background: '#F1F5F9',
//           border: '1px solid var(--border)',
//           borderRadius: 12,
//         }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//             <span className="label">Export Quality</span>
//             <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-light)' }}>
//               {Math.round(quality * 100)}%
//             </span>
//           </div>
//           <input
//             type="range" min="0.1" max="1.0" step="0.05"
//             value={quality}
//             onChange={(e) => setQuality(parseFloat(e.target.value))}
//           />
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.7rem', color: 'var(--text-3)' }}>
//             <span>Smaller file</span>
//             <span>Best quality</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
