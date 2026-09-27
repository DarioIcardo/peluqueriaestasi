/**
 * Peluquería Arxemil - Cliente Supabase
 * Inicialización limpia y segura del cliente Supabase para el navegador.
 */

// Importación ESM oficial desde CDN (sin requerir empaquetadores como Webpack/Vite)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let supabaseInstance = null;

/**
 * Comprueba si las variables de entorno públicas de Supabase están configuradas.
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  const env = (typeof window !== 'undefined' && window.__ENV__) ? window.__ENV__ : {};
  const url = env.SUPABASE_URL || '';
  const key = env.SUPABASE_ANON_KEY || '';
  return Boolean(url && key && !url.includes('tu-proyecto') && !key.includes('tu-clave-anon'));
}

/**
 * Inicializa y devuelve la instancia singleton del cliente Supabase.
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const env = (typeof window !== 'undefined' && window.__ENV__) ? window.__ENV__ : {};
  const SUPABASE_URL = env.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || '';

  if (!isSupabaseConfigured()) {
    console.info(
      '[Supabase] Modo local/mock activo: Las credenciales públicas aún no están configuradas en window.__ENV__ (assets/js/config.js). ' +
      'La aplicación continuará usando mockData.js de forma transparente.'
    );
    return null;
  }

  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return supabaseInstance;
  } catch (error) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
      ? window.location.origin
      : 'origen desconocido';

    console.error(
      `[Supabase Connection/CORS Error] Fallo al inicializar o conectar con Supabase. ` +
      `Si experimentas problemas de conexión o bloqueo CORS, revisa las URLs permitidas en la consola de Supabase para el origen actual: ${origin}`,
      error
    );
    return null;
  }
}

export const supabase = getSupabaseClient();
