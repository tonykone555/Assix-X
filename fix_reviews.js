const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

const stateAdd = `
  const [generatingReviews, setGeneratingReviews] = useState(false);
  const [nicheReviews, setNicheReviews] = useState<any[]>([]);
  const generateNicheReviews = async () => {};
`;

if (!content.includes('const [generatingReviews')) {
  content = content.replace('const [gifUrl, setGifUrl]', stateAdd + '\\n  const [gifUrl, setGifUrl]');
}

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
