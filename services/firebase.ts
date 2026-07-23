import { db } from '../firebase-client-wrapper';

export function formatPhone(raw: string, countryOrCity?: string, address?: string) {
  if (!raw) return '';
  
  // Clean raw input from any spaces, dashes, parentheses
  const digits = raw.replace(/\D/g, '');
  if (!digits) return raw;

  // Let's deduce country prefix based on country/city string or address
  let countryCode = '';
  const context = ((countryOrCity || '') + ' ' + (address || '')).toLowerCase();

  const frCities = ['paris', 'lyon', 'marseille', 'bordeaux', 'nice', 'france', 'fr', 'strasbourg', 'nantes', 'lille', 'toulouse', 'goutte d\'or', 'rue de la', 'rue '];
  const ukCities = ['london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'united kingdom', 'uk', 'gb', 'england', 'scotland', 'cardiff', 'belfast'];
  const auCities = ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'australia', 'au', 'gold coast'];
  const deCities = ['berlin', 'munich', 'hamburg', 'frankfurt', 'germany', 'deutschland', 'de', 'cologne', 'stuttgart', 'dusseldorf'];

  if (frCities.some(city => context.includes(city))) {
    countryCode = '33';
  } else if (ukCities.some(city => context.includes(city))) {
    countryCode = '44';
  } else if (auCities.some(city => context.includes(city))) {
    countryCode = '61';
  } else if (deCities.some(city => context.includes(city))) {
    countryCode = '49';
  }

  // If we couldn't deduce from context, check if the raw number itself looks like it has a specific international prefix
  if (!countryCode) {
    if (raw.startsWith('+33') || (digits.startsWith('33') && digits.length === 11)) {
      countryCode = '33';
    } else if (raw.startsWith('+44') || (digits.startsWith('44') && digits.length === 12)) {
      countryCode = '44';
    } else if (raw.startsWith('+61') || (digits.startsWith('61') && digits.length === 11)) {
      countryCode = '61';
    } else if (raw.startsWith('+49') || (digits.startsWith('49') && digits.length >= 11 && digits.length <= 13)) {
      countryCode = '49';
    } else if (raw.startsWith('+1') || (digits.startsWith('1') && digits.length === 11)) {
      countryCode = '1';
    } else if (digits.startsWith('0') && digits.length === 10) {
      // Numbers starting with '0' in a 10-digit format are French by default in this app context
      countryCode = '33';
    }
  }

  // Format based on deduced country
  if (countryCode === '33') {
    let localDigits = digits;
    if (localDigits.startsWith('33')) {
      localDigits = localDigits.slice(2);
    } else if (localDigits.startsWith('13') && (localDigits.length === 11 || localDigits.length === 12)) {
      localDigits = localDigits.slice(2);
    } else if (localDigits.startsWith('10') && (localDigits.length === 11 || localDigits.length === 12)) {
      localDigits = localDigits.slice(2);
    } else if (localDigits.startsWith('1') && localDigits.length === 11) {
      localDigits = localDigits.slice(1);
    }
    if (localDigits.startsWith('0')) {
      localDigits = localDigits.slice(1);
    }
    return `+33${localDigits}`;
  }

  if (countryCode === '44') {
    let localDigits = digits;
    if (localDigits.startsWith('44')) {
      localDigits = localDigits.slice(2);
    }
    if (localDigits.startsWith('0')) {
      localDigits = localDigits.slice(1);
    }
    return `+44${localDigits}`;
  }

  if (countryCode === '61') {
    let localDigits = digits;
    if (localDigits.startsWith('61')) {
      localDigits = localDigits.slice(2);
    }
    if (localDigits.startsWith('0')) {
      localDigits = localDigits.slice(1);
    }
    return `+61${localDigits}`;
  }

  if (countryCode === '49') {
    let localDigits = digits;
    if (localDigits.startsWith('49')) {
      localDigits = localDigits.slice(2);
    }
    if (localDigits.startsWith('0')) {
      localDigits = localDigits.slice(1);
    }
    return `+49${localDigits}`;
  }

  // Fallback to standard +1 North American behavior
  if (countryCode === '1' || digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))) {
    let localDigits = digits;
    if (localDigits.startsWith('1') && localDigits.length === 11) {
      localDigits = localDigits.slice(1);
    }
    return `+1${localDigits}`;
  }

  if (raw.startsWith('+')) {
    return '+' + digits;
  }

  return '+' + digits;
}

export async function getTaskFromFirestore(taskId: string) {
  const snap = await db.collection('assix_tasks').doc(taskId).get();
  return snap.exists ? snap.data() : null;
}

export async function saveTaskToFirestore(taskId: string, data: any, options?: any) {
  await db.collection('assix_tasks').doc(taskId).set(data, options);
}

export async function updateTaskInFirestore(taskId: string, data: any) {
  await db.collection('assix_tasks').doc(taskId).update(data);
}

export async function saveLeadToFirestore(lead: any) {
  try {
    // Check if phone or name already exists under this task to avoid duplicates
    if (lead.phone && lead.phone.length >= 7) {
      const exists = await db.collection('leads')
        .where('taskId', '==', lead.taskId)
        .where('phone', '==', lead.phone)
        .limit(1)
        .get();
      if (!exists.empty) return false;
    } else if (lead.businessName) {
      const exists = await db.collection('leads')
        .where('taskId', '==', lead.taskId)
        .where('businessName', '==', lead.businessName)
        .limit(1)
        .get();
      if (!exists.empty) return false;
    }

    await db.collection('leads').add({
      ...lead,
      createdAt: new Date().toISOString(),
      sentToClose: false,
      status: 'new'
    });
    return true;
  } catch (err) {
    console.error('saveLeadToFirestore error:', err);
    return false;
  }
}
