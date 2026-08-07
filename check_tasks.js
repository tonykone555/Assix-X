const { db } = require('./firebase-client-wrapper');

async function check() {
  try {
    console.log("Fetching tasks from assix_tasks...");
    const snap = await db.collection('assix_tasks').orderBy('createdAt', 'desc').limit(5).get();
    console.log(`Found ${snap.docs.length} tasks:`);
    for (const doc of snap.docs) {
      const data = doc.data();
      console.log(`- TaskId: ${doc.id}`);
      console.log(`  Label: ${data.label}`);
      console.log(`  TaskType: ${data.taskType}`);
      console.log(`  Status: ${data.status}`);
      console.log(`  Error: ${data.error || 'None'}`);
      console.log(`  LiveViewUrl: ${data.liveViewUrl || 'None'}`);
      console.log(`  SteelDebugUrl: ${data.steelDebugUrl || 'None'}`);
      console.log(`  CreatedAt: ${data.createdAt}`);
      
      // Let's also check if there are subcollection logs
      const logsSnap = await db.collection('assix_tasks').doc(doc.id).collection('logs').orderBy('timestamp', 'desc').limit(3).get();
      if (!logsSnap.empty) {
        console.log(`  Logs count: ${logsSnap.docs.length}`);
        for (const logDoc of logsSnap.docs) {
          console.log(`    * [${logDoc.data().timestamp}] ${logDoc.data().message || logDoc.data().msg}`);
        }
      }
    }
    
    console.log("\nFetching leads count...");
    const leadsSnap = await db.collection('leads').limit(5).get();
    console.log(`Found ${leadsSnap.docs.length} sample leads:`);
    for (const lead of leadsSnap.docs) {
      console.log(`- Lead: ${lead.data().businessName} | Phone: ${lead.data().phone} | Website: ${lead.data().website}`);
    }

  } catch (err) {
    console.error("Error checking tasks:", err);
  }
}

check();
