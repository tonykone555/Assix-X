const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

// We will add the save logic inside the component
const stateToSave = `
  const handleSaveProject = () => {
    try {
      const projectData = {
        siteData,
        aiPrompt,
        badgeNiche,
        dentistActiveModel,
        dentistVeneerShade,
        dentistVeneerShape,
        dentistSliderPos,
        dentistAutoPlay,
        dentistUploadedImage,
        googleScreenshotUrl,
        selectedLang
      };
      localStorage.setItem('assix_saved_project', JSON.stringify(projectData));
      alert('Project saved successfully! You can load it later.');
    } catch (e) {
      console.error(e);
      alert('Failed to save project.');
    }
  };

  const handleLoadProject = () => {
    try {
      const saved = localStorage.getItem('assix_saved_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.siteData) setSiteData(parsed.siteData);
        if (parsed.aiPrompt) setAiPrompt(parsed.aiPrompt);
        if (parsed.badgeNiche) setBadgeNiche(parsed.badgeNiche);
        if (parsed.dentistActiveModel) setDentistActiveModel(parsed.dentistActiveModel);
        if (parsed.dentistVeneerShade) setDentistVeneerShade(parsed.dentistVeneerShade);
        if (parsed.dentistVeneerShape) setDentistVeneerShape(parsed.dentistVeneerShape);
        if (parsed.dentistSliderPos) setDentistSliderPos(parsed.dentistSliderPos);
        if (parsed.dentistAutoPlay !== undefined) setDentistAutoPlay(parsed.dentistAutoPlay);
        if (parsed.dentistUploadedImage) setDentistUploadedImage(parsed.dentistUploadedImage);
        if (parsed.googleScreenshotUrl) setGoogleScreenshotUrl(parsed.googleScreenshotUrl);
        if (parsed.selectedLang) setSelectedLang(parsed.selectedLang);
        alert('Project loaded successfully!');
      } else {
        alert('No saved project found.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load project.');
    }
  };
`;

if (!content.includes('handleSaveProject')) {
  content = content.replace('const handleDeployToNetlify', stateToSave + '\\n  const handleDeployToNetlify');
}

const buttonsToInsert = `
            <button
              onClick={handleLoadProject}
              className="text-[11px] font-bold text-emerald-500 hover:text-emerald-400 transition flex items-center gap-1 tracking-wider uppercase"
              title="Load Saved Project"
            >
              LOAD
            </button>
            <button
              onClick={handleSaveProject}
              className="text-[11px] font-bold text-amber-500 hover:text-amber-400 transition flex items-center gap-1 tracking-wider uppercase"
              title="Save Project"
            >
              SAVE
            </button>
            <button
              onClick={handleDownloadZip}
`;

content = content.replace(/<button\s+onClick=\{handleDownloadZip\}/, buttonsToInsert);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
