const SUPABASE_URL = "https://bdmzqapfwgohgkctmzht.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXpxYXBmd2dvaGdrY3Rtemh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTE0MDcsImV4cCI6MjA2OTI2NzQwN30.EUrn0pIDQNBCyAqo3Z8fIi22ZKgxv91I6sI7_0ujw20"; // তোমার Public anon key
const supabaseConn = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* START::Hit Logs */
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters[randomIndex]
    }
    return result
};

async function insertHitlog(publicIp) {

    // Step 1: Check if token exists
    const { data: existing, error: selectError } = await supabaseConn
        .from('hitlogs')
        .select('id, counter')
        .eq('ip_address', publicIp)
        .single();

    if (selectError && selectError.code !== 'PGRST116') {
        console.error('Select error:', selectError);
    } else if (existing) {
        const newCounter = (existing.counter || 0) + 1;

        const { data: updated, error: updateError } = await supabaseConn
            .from('hitlogs')
            .update({ counter: newCounter })
            .eq('id', existing.id);

        if (updateError) {
            console.error('Update error:', updateError);
        } else {
            console.log('Counter incremented:', updated);
        }
    } else {
        const { data: inserted, error: insertError } = await supabaseConn
            .from('hitlogs')
            .insert({ ip_address: publicIp, counter: 1 });

        if (insertError) {
            console.error('Insert error:', insertError);
        } else {
            console.log('New row inserted:', inserted);
        }
    }
}


async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        sessionStorage.setItem('ip_address', data.ip);
        insertHitlog(data.ip);
    } catch (error) {
        console.error('Error fetching IP:', error);
        return null;
    }
}

getPublicIP();

/* END::Hit Logs */




