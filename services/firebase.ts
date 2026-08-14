import { db } from '../firebase-client-wrapper';

export function formatPhone(raw: string, countryOrCity?: string, address?: string): string {
  if (!raw || raw.toLowerCase().includes('no phone') || raw.toLowerCase().includes('n/a')) return '';

  // Clean raw input
  const digits = raw.replace(/\D/g, '');
  if (!digits || digits.length < 8 || digits.length > 15) return '';

  // REJECT TIMESTAMPS: 10-digit or 13-digit Unix timestamps (e.g., 1785146554)
  if (/^(17|18|16|15|19)\d{8,11}$/.test(digits)) {
    return '';
  }

  // REJECT REPEATED DIGITS (e.g. 0000000000, 1111111111)
  if (/^(\d)\1+$/.test(digits)) {
    return '';
  }

  // Deduce country prefix based on country/city string or address
  let countryCode = '';
  const context = ((countryOrCity || '') + ' ' + (address || '')).toLowerCase();

  const matchKeyword = (kwList: string[]) => {
    return kwList.some(k => {
      if (k.length <= 3) {
        // Use word boundary for short codes like 'de', 'fr', 'uk', 'es', 'it', 'ch', 'be'
        const regex = new RegExp(`\\b${k}\\b`, 'i');
        return regex.test(context);
      }
      return context.includes(k);
    });
  };

  const frKeywords = ['france', 'french', 'paris', 'lyon', 'marseille', 'bordeaux', 'nice', 'toulouse', 'nantes', 'strasbourg', 'lille', 'montpellier', 'rennes', 'reims', 'le havre', 'saint-étienne', 'toulon', 'grenoble', 'dijon', 'anger', 'nîmes', 'fr'];
  const deKeywords = ['germany', 'deutschland', 'german', 'berlin', 'munich', 'münchen', 'hamburg', 'frankfurt', 'cologne', 'köln', 'stuttgart', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'dresden', 'hannover', 'nuremberg', 'nürnberg', 'duisburg', 'bochum', 'wuppertal', 'bielefeld', 'bonn', 'de', '49'];
  const ukKeywords = ['united kingdom', 'uk', 'england', 'scotland', 'wales', 'london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'edinburgh', 'cardiff', 'belfast', 'gb'];
  const auKeywords = ['australia', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'au', 'gold coast'];
  const esKeywords = ['spain', 'españa', 'madrid', 'barcelona', 'valencia', 'seville', 'sevilla', 'malaga', 'zaragoza', 'es'];
  const itKeywords = ['italy', 'italia', 'rome', 'roma', 'milan', 'milano', 'naples', 'napoli', 'turin', 'torino', 'it'];
  const chKeywords = ['switzerland', 'suisse', 'schweiz', 'zurich', 'zürich', 'geneva', 'genève', 'basel', 'ch'];
  const beKeywords = ['belgium', 'belgique', 'belgien', 'brussels', 'bruxelles', 'antwerp', 'ghent', 'be'];
  const nlKeywords = ['netherlands', 'nederland', 'amsterdam', 'rotterdam', 'the hague', 'utrecht', 'nl'];
  const ptKeywords = ['portugal', 'lisbon', 'lisboa', 'porto', 'pt'];

  if (matchKeyword(frKeywords)) {
    countryCode = '33';
  } else if (matchKeyword(deKeywords)) {
    countryCode = '49';
  } else if (matchKeyword(ukKeywords)) {
    countryCode = '44';
  } else if (matchKeyword(esKeywords)) {
    countryCode = '34';
  } else if (matchKeyword(itKeywords)) {
    countryCode = '39';
  } else if (matchKeyword(chKeywords)) {
    countryCode = '41';
  } else if (matchKeyword(beKeywords)) {
    countryCode = '32';
  } else if (matchKeyword(nlKeywords)) {
    countryCode = '31';
  } else if (matchKeyword(ptKeywords)) {
    countryCode = '351';
  } else if (matchKeyword(auKeywords)) {
    countryCode = '61';
  }

  // If raw input explicitly starts with +
  if (raw.startsWith('+')) {
    if (raw.startsWith('+33') || digits.startsWith('33')) {
      let rest = digits.startsWith('33') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+33${rest}`;
    }
    if (raw.startsWith('+49') || digits.startsWith('49')) {
      let rest = digits.startsWith('49') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+49${rest}`;
    }
    if (raw.startsWith('+44') || digits.startsWith('44')) {
      let rest = digits.startsWith('44') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+44${rest}`;
    }
    if (raw.startsWith('+34') || digits.startsWith('34')) {
      let rest = digits.startsWith('34') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+34${rest}`;
    }
    if (raw.startsWith('+39') || digits.startsWith('39')) {
      let rest = digits.startsWith('39') ? digits.slice(2) : digits;
      return `+39${rest}`;
    }
    if (raw.startsWith('+41') || digits.startsWith('41')) {
      let rest = digits.startsWith('41') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+41${rest}`;
    }
    if (raw.startsWith('+32') || digits.startsWith('32')) {
      let rest = digits.startsWith('32') ? digits.slice(2) : digits;
      if (rest.startsWith('0')) rest = rest.slice(1);
      return `+32${rest}`;
    }
    if (raw.startsWith('+1') || (digits.startsWith('1') && digits.length === 11)) {
      let rest = digits.startsWith('1') && digits.length === 11 ? digits.slice(1) : digits;
      return `+1${rest}`;
    }
    return `+${digits}`;
  }

  // If we couldn't deduce from context, check if digits start with a known country code
  if (!countryCode) {
    if (digits.startsWith('33') && digits.length >= 11) countryCode = '33';
    else if (digits.startsWith('49') && digits.length >= 11) countryCode = '49';
    else if (digits.startsWith('44') && digits.length >= 11) countryCode = '44';
    else if (digits.startsWith('34') && digits.length >= 11) countryCode = '34';
    else if (digits.startsWith('39') && digits.length >= 10) countryCode = '39';
    else if (digits.startsWith('41') && digits.length >= 11) countryCode = '41';
    else if (digits.startsWith('32') && digits.length >= 10) countryCode = '32';
    else if (digits.startsWith('1') && digits.length === 11) countryCode = '1';
    else if (digits.length === 10 && /^[2-9]/.test(digits)) {
      // Standard US/North American 10-digit number (area code starting 2-9)
      countryCode = '1';
    } else {
      // Default fallback based on digit pattern
      countryCode = digits.startsWith('0') ? '33' : '1';
    }
  }

  // Format based on countryCode
  let localDigits = digits;

  if (countryCode === '33') {
    if (localDigits.startsWith('33')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+33${localDigits}`;
  }

  if (countryCode === '49') {
    if (localDigits.startsWith('49')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+49${localDigits}`;
  }

  if (countryCode === '44') {
    if (localDigits.startsWith('44')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+44${localDigits}`;
  }

  if (countryCode === '34') {
    if (localDigits.startsWith('34')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+34${localDigits}`;
  }

  if (countryCode === '39') {
    if (localDigits.startsWith('39')) localDigits = localDigits.slice(2);
    return `+39${localDigits}`;
  }

  if (countryCode === '41') {
    if (localDigits.startsWith('41')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+41${localDigits}`;
  }

  if (countryCode === '32') {
    if (localDigits.startsWith('32')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+32${localDigits}`;
  }

  if (countryCode === '61') {
    if (localDigits.startsWith('61')) localDigits = localDigits.slice(2);
    if (localDigits.startsWith('0')) localDigits = localDigits.slice(1);
    return `+61${localDigits}`;
  }

  if (countryCode === '1') {
    if (localDigits.startsWith('1') && localDigits.length === 11) localDigits = localDigits.slice(1);
    return `+1${localDigits}`;
  }

  if (localDigits.startsWith(countryCode)) {
    localDigits = localDigits.slice(countryCode.length);
  }
  if (localDigits.startsWith('0')) {
    localDigits = localDigits.slice(1);
  }
  return `+${countryCode}${localDigits}`;
}

export async function getTaskFromFirestore(taskId: string) {
  try {
    const snap = await Promise.race([
      db.collection('assix_tasks').doc(taskId).get(),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 6000))
    ]);
    return snap && snap.exists ? snap.data() : null;
  } catch (e) {
    return null;
  }
}

export async function saveTaskToFirestore(taskId: string, data: any, options?: any) {
  try {
    await Promise.race([
      db.collection('assix_tasks').doc(taskId).set(data, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 6000))
    ]);
  } catch (e: any) {
    // Non-fatal notice
  }
}

export async function updateTaskInFirestore(taskId: string, data: any) {
  try {
    await Promise.race([
      db.collection('assix_tasks').doc(taskId).update(data),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 6000))
    ]);
  } catch (e: any) {
    // Non-fatal notice
  }
}

export async function logAction(taskId: string, msg: string, type = 'info') {
  if (!taskId) return;
  const entry = { time: new Date().toLocaleTimeString('en-GB'), msg, type, timestamp: Date.now() };
  try {
    await Promise.race([
      db.collection('assix_tasks').doc(taskId).collection('logs').add(entry),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000))
    ]);
  } catch (e) {
    // Suppress non-critical log notices
  }
}

export async function saveLeadToFirestore(lead: any) {
  try {
    const businessName = lead.businessName || lead.company || lead.name || 'Business';
    const company = lead.company || lead.businessName || lead.name || 'Business';

    // Prevent duplicate entries by querying company name in firestore
    const existing = await db.collection('leads')
      .where('company', '==', company)
      .limit(1)
      .get();

    const docData = {
      ...lead,
      businessName,
      company,
      name: lead.name || businessName || 'Business',
      createdAt: lead.createdAt || new Date().toISOString(),
      sentToClose: Boolean(lead.sentToClose),
      status: lead.status || 'new'
    };

    if (!existing.empty) {
      console.log(`[Firebase] Duplicate lead found for "${company}". Merging fields and linking to current task: ${lead.taskId}`);
      const existingDoc = existing.docs[0];
      const existingId = existingDoc.id;
      const existingData = existingDoc.data() || {};

      // Merge data: prioritize new fields (phone, email, website, etc.) if they were found or richer
      const updatedData = {
        ...existingData,
        ...lead,
        phone: lead.phone || existingData.phone || '',
        email: lead.email || existingData.email || null,
        website: lead.website || existingData.website || '',
        address: lead.address || existingData.address || '',
        taskId: lead.taskId || existingData.taskId || '',
        sourceRun: lead.sourceRun || lead.taskId || existingData.sourceRun || '',
        updatedAt: new Date().toISOString()
      };

      // Update the existing document in standard leads collection
      await db.collection('leads').doc(existingId).set(updatedData, { merge: true }).catch(() => {});

      // Add or update in assix_leads for the current running task
      if (lead.taskId) {
        const taskLeadExisting = await db.collection('assix_leads')
          .where('company', '==', company)
          .where('taskId', '==', lead.taskId)
          .limit(1)
          .get();

        if (taskLeadExisting.empty) {
          await db.collection('assix_leads').add({
            ...updatedData,
            leadId: existingId,
            id: existingId,
            createdAt: new Date().toISOString()
          }).catch(() => {});
        } else {
          const assixDocId = taskLeadExisting.docs[0].id;
          await db.collection('assix_leads').doc(assixDocId).set({
            ...updatedData,
            leadId: existingId,
            id: existingId,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      }

      return true;
    }

    // New lead creation: check if it's already in assix_leads for some reason to be perfectly safe
    const assixExisting = lead.taskId ? await db.collection('assix_leads')
      .where('company', '==', company)
      .where('taskId', '==', lead.taskId)
      .limit(1)
      .get() : null;

    if (assixExisting && !assixExisting.empty) {
      const assixDocId = assixExisting.docs[0].id;
      await Promise.allSettled([
        db.collection('leads').add(docData),
        db.collection('assix_leads').doc(assixDocId).set(docData, { merge: true })
      ]);
    } else {
      await Promise.allSettled([
        db.collection('leads').add(docData),
        db.collection('assix_leads').add(docData)
      ]);
    }
    return true;
  } catch (err: any) {
    console.error('saveLeadToFirestore error:', err?.message || err);
    return true;
  }
}
