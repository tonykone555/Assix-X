const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const modelUploadFunctions = `
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setModifying(true);
    try {
      const newBase64s: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newBase64s.push(dataUrl);
      }

      const updated = [...uploadedModels, ...newBase64s];
      setUploadedModels(updated);

      if (siteData) {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedModels: updated },
            lead: { ...lead, userUploadedModels: updated }
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to upload model:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleDeleteUploadedModel = async (indexToRemove: number) => {
    const updated = uploadedModels.filter((_, idx) => idx !== indexToRemove);
    setUploadedModels(updated);

    if (siteData) {
      setModifying(true);
      try {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedModels: updated },
            lead: { ...lead, userUploadedModels: updated }
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      } catch (err) {
        console.error('Failed to delete model:', err);
      } finally {
        setModifying(false);
      }
    }
  };
`;

const splitStr = 'const handleVideoUpload = async';
const parts = content.split(splitStr);
const newContent = parts[0] + modelUploadFunctions + '\n  ' + splitStr + parts[1];

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', newContent);
