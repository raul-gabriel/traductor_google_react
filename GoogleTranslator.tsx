import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

const GoogleTranslator: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Evitar cargar múltiples veces
    if ((window as any).googleTranslateElementInit) {
      return;
    }
    
    // Función de inicialización
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'es',
            includedLanguages: 'es,en,fr,de,it,pt',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL
          },
          'google_translate_element'
        );
        
        setTimeout(() => setIsReady(true), 1500);
      }
    };
    
    // Cargar el script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    document.body.appendChild(script);
    
    // Observer para detectar y ocultar el banner cuando aparezca
    const observer = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) {
        (banner as HTMLElement).style.display = 'none';
      }
      // Resetear el top del body
      if (document.body.style.top) {
        document.body.style.top = '0';
        document.body.style.position = 'static';
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => {
      observer.disconnect();
      // Limpiar cuando se desmonte el componente
      const scriptElements = document.querySelectorAll('script[src*="translate.google"]');
      scriptElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <div >
        <div id="google_translate_element"></div>
      </div>

      <style>{`

        /* === Ocultar texto "Traducido por Google" === */
        div#google_translate_element div span {
    display: none !important;
}

        

        /* === CRÍTICO: Ocultar banner === */
        .goog-te-banner-frame,
        body > .skiptranslate,
        iframe.skiptranslate,
        #goog-gt-tt,
        .goog-te-balloon-frame {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }

        /* === Ocultar TODO excepto el select === */
        .goog-te-gadget {
          font-size: 0 !important;
        }
        
        /* Mostrar SOLO el select */
        .goog-te-combo {
          font-size: 14px !important;
          margin: 0 !important;
          padding: 8px 32px 8px 12px !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          background-color: #ffffff !important;
          cursor: pointer !important;
          min-width: 150px !important;
          display: inline-block !important;
        }

        .goog-te-combo:hover {
          border-color: #3b82f6 !important;
        }

        .goog-te-combo:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </>
  );
};

export default GoogleTranslator;
