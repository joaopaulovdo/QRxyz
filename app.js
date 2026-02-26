const SUPABASE_URL = 'https://yzpylhczseindmvmqyrq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MJqvwv52E_E3GyoxmycVCw_6SVvi3YJ';

// Initialize Supabase Client
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth state observer
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/' && !window.location.pathname.includes('ativar.html')) {
            window.location.href = '/index.html';
        }
    }
});

async function getCurrentUser() {
    try {
        const { data: { session }, error: sessionError } = await window.supabaseClient.auth.getSession();
        if (sessionError || !session) return null;
        
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        return { ...session.user, profile: profile || {} };
    } catch (err) {
        console.error("Error getting user:", err);
        return null;
    }
}

async function logout() {
    try {
        await window.supabaseClient.auth.signOut();
    } catch (e) {
        console.error("Error during sign out:", e);
    }
    // Force clear local storage to ensure session is destroyed locally
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/index.html';
}
