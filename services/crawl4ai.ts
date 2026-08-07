const CRAWL4AI_URL = process.env.CRAWL4AI_URL || 'https://crawl4ai-production-8e63.up.railway.app';

export async function crawlPage(url: string): Promise<{ markdown: string; html: string; success: boolean }> {
  try {
    const response = await fetch(`${CRAWL4AI_URL}/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [url],
        word_count_threshold: 10,
      }),
    });
    const data = await response.json();
    const result = Array.isArray(data.results) ? data.results[0] : data;
    return {
      markdown: result?.markdown?.raw_markdown || result?.markdown || '',
      html: result?.cleaned_html || result?.html || '',
      success: result?.success !== false,
    };
  } catch (err: any) {
    console.error('Crawl4AI request failed:', err.message);
    return { markdown: '', html: '', success: false };
  }
}
