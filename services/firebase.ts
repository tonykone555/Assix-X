import { db } from '../firebase-client-wrapper';

export function formatPhone(raw: string) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return '+' + digits;
  if (digits.length === 10) return '+1' + digits;
  if (digits.length > 10) return '+1' + digits.slice(-10);
  return raw;
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
