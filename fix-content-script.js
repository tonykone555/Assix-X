const fs = require('fs');
const path = require('path');

const filePath = '/tmp/page-agent/packages/extension/src/entrypoints/content.ts';
if (!fs.existsSync(filePath)) {
  console.error('File not found at:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

const hook = '// Assix Browser Agent bridge';
const index = content.indexOf(hook);

if (index !== -1) {
  const prefix = content.substring(0, index);
  const goodBridge = `// Assix Browser Agent bridge
let assixAgentInstance: any = null;
window.addEventListener('message', async (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.source !== 'assix-dashboard') return;
  
  if (event.data?.type === 'ping') {
    window.postMessage({ 
       source: 'assix-agent', 
       type: 'pong' 
     }, '*');
    return;
  }
  
  if (event.data?.instruction) {
    try {
      if (!assixAgentInstance) {
        const { MultiPageAgent } = await import('@/agent/MultiPageAgent');
        assixAgentInstance = new MultiPageAgent({});
      }
      const result = await assixAgentInstance.execute(event.data.instruction);
      window.postMessage({
        source: 'assix-agent',
        taskId: event.data.taskId,
        result,
        status: 'complete'
      }, '*');
    } catch (err) {
      window.postMessage({
        source: 'assix-agent',
        taskId: event.data.taskId,
        error: err.message,
        status: 'failed'
      }, '*');
    }
  }
});
`;

  fs.writeFileSync(filePath, prefix + goodBridge, 'utf8');
  console.log('Successfully patched content.ts!');
} else {
  console.error('Could not find the hook in content.ts!');
}
