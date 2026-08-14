import { createStagehandSession } from "./browserEngine";
import { logAction } from "./firebase";
import { extractLeadsWithHyperbrowser, isHyperbrowserConfigured } from "./hyperbrowserService";
import { extractEmailsFromMarkdown, extractPhonesFromMarkdown } from "./jinaReaderService";

export async function runPlaywriterCommand(
  userId: string,
  sessionId: string,
  codeStr: string
): Promise<string> {
  const sessionKey = sessionId || `pw-${userId || 'default'}`;
  const { page } = await createStagehandSession(sessionKey);

  let capturedLog = '';
  const logHandler = (msg: any) => {
    try {
      capturedLog += (typeof msg.text === 'function' ? msg.text() : String(msg)) + '\n';
    } catch {
      capturedLog += String(msg) + '\n';
    }
  };

  if (page && typeof page.on === 'function') {
    page.on('console', logHandler);
  }

  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction('page', codeStr);
    const result = await fn(page);

    if (page && typeof page.off === 'function') {
      page.off('console', logHandler);
    }

    if (capturedLog.trim()) {
      return capturedLog.trim();
    }
    if (result !== undefined && result !== null) {
      return typeof result === 'object' ? JSON.stringify(result) : String(result);
    }
    return '';
  } catch (err: any) {
    if (page && typeof page.off === 'function') {
      page.off('console', logHandler);
    }
    throw err;
  }
}

export async function enrichWebsiteViaPlaywriter(
  userId: string,
  sessionId: string,
  websiteUrl: string,
  taskId?: string
): Promise<{ 
  email: string | null; 
  phone?: string | null;
  secondaryPhone?: string | null;
  socialLinks: Record<string, string>; 
  description: string | null;
  websiteAudit?: {
    needsRedesign: boolean;
    qualityNote: string;
    improvements: string[];
  }
}> {
  const result: {
    email: string | null;
    phone?: string | null;
    secondaryPhone?: string | null;
    socialLinks: Record<string, string>;
    description: string | null;
    websiteAudit?: {
      needsRedesign: boolean;
      qualityNote: string;
      improvements: string[];
    }
  } = { 
    email: null, 
    phone: null,
    secondaryPhone: null,
    socialLinks: {}, 
    description: null 
  };

  try {
    // 1. Direct HTTP HTML contact extraction
    try {
      if (taskId) {
        await logAction(taskId, `⚡ Running direct web contact extraction for ${websiteUrl}...`, 'info').catch(() => {});
      }
      const axios = (await import('axios')).default;
      const directRes = await axios.get(websiteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 6000
      });
      const html = typeof directRes.data === 'string' ? directRes.data : '';
      const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
      
      const emails = extractEmailsFromMarkdown(html + '\n' + cleanText);
      const phones = extractPhonesFromMarkdown(html + '\n' + cleanText, websiteUrl);

      if (emails.length > 0) result.email = emails[0];
      if (phones.length > 0) {
        result.phone = phones[0];
        result.secondaryPhone = phones[0];
      }

      const socialLinks: Record<string, string> = {};
      const linkMatches = [...html.matchAll(/https?:\/\/(?:www\.)?(linkedin|twitter|x|facebook|instagram|youtube|tiktok)\.com\/[A-Za-z0-9_.-]+/gi)];
      for (const match of linkMatches) {
        const platform = match[1].toLowerCase();
        if (!socialLinks[platform]) socialLinks[platform] = match[0];
      }
      if (Object.keys(socialLinks).length > 0) {
        result.socialLinks = socialLinks;
      }
      result.description = cleanText.slice(0, 300).trim();
      // Fast heuristic website audit from direct HTML if already extracted
      const hasViewport = /name=["']viewport["']/i.test(html);
      const isHttps = websiteUrl.startsWith('https:');
      const hasForm = /<form|iframe[^>]*src=["'][^"']*form/i.test(html);
      const hasCta = /href=["'][^"']*(contact|book|devis|reservation)/i.test(html) || /<button|<input[^>]*type=["']submit["']/i.test(html);
      const points: string[] = [];
      if (!hasViewport) points.push("Missing mobile responsive viewport meta tag");
      if (!isHttps) points.push("Insecure HTTP connection (missing SSL certificate)");
      if (!hasCta) points.push("No clear conversion call-to-action or booking button");
      if (!hasForm) points.push("Lacks instant lead capture or booking form");

      const needsRedesign = points.length >= 2 || !hasViewport || !hasCta || !isHttps;
      result.websiteAudit = {
        needsRedesign,
        qualityNote: needsRedesign 
          ? "Website is poorly built or outdated. Prime opportunity to offer a modern redesign!" 
          : "Website is functional but can be upgraded with modern lead capture and faster performance.",
        improvements: points.length > 0 ? points : [
          "Upgrade to modern high-converting typography & layout",
          "Add instant online appointment booking & automated quotes"
        ]
      };

      // If BOTH email and phone were successfully found by fast HTTP direct scrape, return instantly!
      if (result.email && result.phone) {
        if (taskId) {
          await logAction(taskId, `⚡ Fast web contact extraction succeeded for ${websiteUrl} (Email: ${result.email || 'N/A'}, Phone: ${result.phone || 'N/A'})`, 'success').catch(() => {});
        }
        return result;
      }
    } catch (httpErr: any) {
      console.warn('[WebsiteEnrichment] Direct HTTP scrape note:', httpErr?.message);
    }

    // If Hyperbrowser API is configured, run stealth AI extraction next
    if (isHyperbrowserConfigured()) {
      try {
        if (taskId) {
          await logAction(taskId, `🚀 Running Hyperbrowser AI Stealth Extract for ${websiteUrl}...`, 'info').catch(() => {});
        }
        const hbResult = await extractLeadsWithHyperbrowser({
          urls: [websiteUrl],
          prompt: "Extract business contact details: primary and secondary emails, phone numbers, contact decision makers, social media URLs (LinkedIn, Twitter, Facebook, Instagram), and company description."
        });
        if (hbResult.success && hbResult.data) {
          const hbData = hbResult.data;
          if (hbData.email || hbData.emails?.[0]) result.email = hbData.email || hbData.emails?.[0];
          if (hbData.phone || hbData.phones?.[0] || hbData.secondaryPhone) {
            result.secondaryPhone = hbData.phone || hbData.phones?.[0] || hbData.secondaryPhone;
          }
          if (hbData.socialLinks && typeof hbData.socialLinks === 'object') {
            result.socialLinks = { ...result.socialLinks, ...hbData.socialLinks };
          }
          if (hbData.description) result.description = hbData.description;
        }
      } catch (err: any) {
        console.warn('[WebsiteEnrichment] Hyperbrowser extraction fallback:', err?.message);
      }
    }

    // Navigate to the site, then try common contact/legal-notice paths
    await runPlaywriterCommand(userId, sessionId, `await page.goto('${websiteUrl}', { timeout: 15000 })`);
    await new Promise(r => setTimeout(r, 1500));

    // Perform website audit & check what could be improved on their website
    const auditRaw = await runPlaywriterCommand(
      userId,
      sessionId,
      `console.log(JSON.stringify(await page.evaluate(() => {
        const hasViewport = Boolean(document.querySelector('meta[name="viewport"]'));
        const isHttps = location.protocol === 'https:';
        const textLength = (document.body && document.body.innerText) ? document.body.innerText.length : 0;
        const hasForm = Boolean(document.querySelector('form, iframe[src*="form"]'));
        const hasCta = Boolean(document.querySelector('a[href*="contact"], a[href*="book"], a[href*="devis"], button, a.btn, a.button, input[type="submit"]'));
        const hasHeader = Boolean(document.querySelector('header, nav, .header, #header'));
        const isTableLayout = Boolean(document.querySelector('table[width], table[border], table[cellpadding]'));

        const points = [];
        if (!hasViewport) points.push("Missing mobile responsive viewport meta tag");
        if (!isHttps) points.push("Insecure HTTP connection (missing SSL certificate)");
        if (!hasCta) points.push("No clear conversion call-to-action or booking button");
        if (!hasForm) points.push("Lacks instant lead capture or booking form");
        if (!hasHeader) points.push("Outdated or non-standard header navigation");
        if (isTableLayout) points.push("Legacy table-based HTML layout structure");
        if (textLength < 300) points.push("Thin content with low SEO & engagement value");

        const needsRedesign = points.length >= 2 || !hasViewport || isTableLayout || !hasCta || !isHttps;

        return {
          needsRedesign,
          qualityNote: needsRedesign 
            ? "Website is poorly built or outdated. Prime opportunity to offer a modern redesign!" 
            : "Website is functional but can be upgraded with modern lead capture and faster performance.",
          improvements: points.length > 0 ? points : [
            "Upgrade to modern high-converting typography & layout",
            "Add instant online appointment booking & automated quotes"
          ]
        };
      })))`
    );

    try {
      if (auditRaw) {
        result.websiteAudit = JSON.parse(auditRaw);
      }
    } catch (e) {
      result.websiteAudit = {
        needsRedesign: true,
        qualityNote: "Website layout and performance require modernization.",
        improvements: ["Add responsive mobile viewport", "Implement direct booking form", "Modernize design and typography"]
      };
    }

    // Extract emails, social media handles, tel links, and phones directly from DOM
    const pageDataRaw = await runPlaywriterCommand(
      userId, sessionId,
      `console.log(JSON.stringify(await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const socials = {};
        const mailtoEmails = [];
        const telLinks = [];

        // Cloudflare email protection decoder
        function cfDecodeEmail(encodedString) {
          try {
            let email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
            for (n = 2; encodedString.length - n > 0; n += 2) {
              i = parseInt(encodedString.substr(n, 2), 16) ^ r;
              email += String.fromCharCode(i);
            }
            return email;
          } catch(e) { return ""; }
        }

        // Check for Cloudflare protected emails
        document.querySelectorAll('[data-cfemail]').forEach(el => {
          const cf = el.getAttribute('data-cfemail');
          if (cf) {
            const decoded = cfDecodeEmail(cf);
            if (decoded && decoded.includes('@')) mailtoEmails.push(decoded.trim());
          }
        });

        links.forEach(l => {
          const href = (l.href || '').trim();
          const lowerHref = href.toLowerCase();

          if (lowerHref.startsWith('mailto:')) {
            const cleanMail = href.replace(/^mailto:/i, '').split('?')[0].trim();
            if (cleanMail && cleanMail.includes('@')) mailtoEmails.push(cleanMail);
          }
          if (lowerHref.startsWith('tel:')) {
            telLinks.push(href.replace(/^tel:/i, '').trim());
          }

          // Social Media Regex Matching
          if (href.match(/facebook\.com|fb\.me/i) && !socials.facebook) socials.facebook = href;
          if (href.match(/instagram\.com|instagr\.am/i) && !socials.instagram) socials.instagram = href;
          if (href.match(/linkedin\.com/i) && !socials.linkedin) socials.linkedin = href;
          if (href.match(/twitter\.com|x\.com/i) && !socials.twitter) socials.twitter = href;
          if (href.match(/youtube\.com|youtu\.be/i) && !socials.youtube) socials.youtube = href;
          if (href.match(/tiktok\.com/i) && !socials.tiktok) socials.tiktok = href;
          if (href.match(/pinterest\.com/i) && !socials.pinterest) socials.pinterest = href;
          if (href.match(/wa\.me|whatsapp\.com/i) && !socials.whatsapp) socials.whatsapp = href;
        });

        const bodyText = document.body ? document.body.innerText : '';
        const htmlText = document.documentElement ? document.documentElement.innerHTML : '';

        // Email Regex Scan
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const textEmails = (bodyText.match(emailRegex) || []).concat(htmlText.match(emailRegex) || []);

        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
        const matches = (bodyText.match(phoneRegex) || [])
          .map(p => p.trim())
          .filter(p => p.replace(/\D/g, '').length >= 7 && p.replace(/\D/g, '').length <= 15);

        const uniquePhones = Array.from(new Set([...telLinks, ...matches]));

        return { mailtoEmails, textEmails, socials, phones: uniquePhones };
      })))`
    );

    const junkEmailFilter = (e: string) => {
      if (!e || typeof e !== 'string') return false;
      const lower = e.toLowerCase();
      const invalidEndings = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.css', '.js', '.woff', '.ttf'];
      if (invalidEndings.some(ext => lower.endsWith(ext))) return false;
      const junkDomains = ['sentry.io', 'example.com', 'domain.com', 'wixpress.com', 'bootstrap.com', 'schema.org', 'gravatar.com', 'npm.js', 'git.io'];
      if (junkDomains.some(d => lower.includes(d))) return false;
      return lower.includes('@') && lower.includes('.');
    };

    try { 
      const parsed = JSON.parse(pageDataRaw);
      if (parsed.socials) result.socialLinks = parsed.socials;
      if (Array.isArray(parsed.phones) && parsed.phones.length > 0) {
        result.phone = parsed.phones[0];
        result.secondaryPhone = parsed.phones[0];
      }

      // Priority 1: mailto emails
      const validMailtos = (parsed.mailtoEmails || []).filter(junkEmailFilter);
      if (validMailtos.length > 0) {
        result.email = validMailtos[0];
      } else {
        // Priority 2: text emails from body/HTML
        const validTextEmails = (parsed.textEmails || []).filter(junkEmailFilter);
        if (validTextEmails.length > 0) {
          result.email = validTextEmails[0];
        }
      }
    } catch {}

    // If no email or phone on homepage, try common contact/legal pages
    if (!result.email || !result.phone) {
      const contactPaths = ['/contact', '/contact-us', '/about', '/about-us', '/mentions-legales', '/impressum'];
      for (const path of contactPaths) {
        try {
          const targetUrl = new URL(path, websiteUrl).toString();
          await runPlaywriterCommand(userId, sessionId, `await page.goto('${targetUrl}', { timeout: 8000 })`);
          await new Promise(r => setTimeout(r, 800));
          const contactPageRaw = await runPlaywriterCommand(
            userId, sessionId,
            `console.log(JSON.stringify(await page.evaluate(() => {
              const links = Array.from(document.querySelectorAll('a[href]'));
              const mailtos = links.filter(l => (l.href || '').toLowerCase().startsWith('mailto:')).map(l => l.href.replace(/^mailto:/i, '').split('?')[0].trim());
              const telLinks = links.filter(l => (l.href || '').toLowerCase().startsWith('tel:')).map(l => l.href.replace(/^tel:/i, '').trim());
              const bodyText = document.body ? document.body.innerText : '';
              const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
              const matches = bodyText.match(emailRegex) || [];
              const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
              const phoneMatches = (bodyText.match(phoneRegex) || [])
                .map(p => p.trim())
                .filter(p => p.replace(/\D/g, '').length >= 7 && p.replace(/\D/g, '').length <= 15);
              return { mailtos, matches, telLinks, phoneMatches };
            })))`
          );
          const parsedContact = JSON.parse(contactPageRaw);
          const validContactEmails = [...(parsedContact.mailtos || []), ...(parsedContact.matches || [])].filter(junkEmailFilter);
          if (!result.email && validContactEmails.length > 0) {
            result.email = validContactEmails[0];
          }
          const validContactPhones = [...(parsedContact.telLinks || []), ...(parsedContact.phoneMatches || [])];
          if (!result.phone && validContactPhones.length > 0) {
            result.phone = validContactPhones[0];
            result.secondaryPhone = validContactPhones[0];
          }
          if (result.email && result.phone) break;
        } catch { continue; }
      }
    }

    // Fast Direct HTTP Fetch Fallback if still no email or no social links found
    if (!result.email || Object.keys(result.socialLinks).length === 0) {
      try {
        const fetchRes = await fetch(websiteUrl, {
          signal: AbortSignal.timeout(6000),
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        const html = await fetchRes.text();

        if (!result.email) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
          const found = (html.match(emailRegex) || []).filter(junkEmailFilter);
          if (found.length > 0) result.email = found[0];
        }

        // Social Media Match via Direct HTML
        if (!result.socialLinks.facebook) {
          const fbMatch = html.match(/https?:\/\/(www\.)?(facebook\.com|fb\.me)\/[a-zA-Z0-9._%-]+/i);
          if (fbMatch) result.socialLinks.facebook = fbMatch[0];
        }
        if (!result.socialLinks.instagram) {
          const igMatch = html.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._%-]+/i);
          if (igMatch) result.socialLinks.instagram = igMatch[0];
        }
        if (!result.socialLinks.linkedin) {
          const liMatch = html.match(/https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9._%-]+/i);
          if (liMatch) result.socialLinks.linkedin = liMatch[0];
        }
        if (!result.socialLinks.twitter) {
          const twMatch = html.match(/https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9._%-]+/i);
          if (twMatch) result.socialLinks.twitter = twMatch[0];
        }
      } catch {}
    }

    if (taskId) await logAction(taskId, `Enriched ${websiteUrl}: email ${result.email ? result.email : 'not found'}, socials: ${Object.keys(result.socialLinks).join(', ') || 'none'}, audit: ${result.websiteAudit?.needsRedesign ? 'Needs Redesign' : 'Good'}`, 'info');
  } catch (err: any) {
    if (taskId) await logAction(taskId, `Website enrichment failed for ${websiteUrl}: ${err.message}`, 'warning');
    result.websiteAudit = {
      needsRedesign: true,
      qualityNote: "Website failed to load cleanly or has strict blocking. Excellent candidate for pitching a reliable new build.",
      improvements: ["Rebuild with high-speed hosting and SSL", "Ensure 100% uptime and accessibility"]
    };
  }

  return result;
}
