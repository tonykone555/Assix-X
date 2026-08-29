const fs = require('fs');
let content = fs.readFileSync('server_clean.ts', 'utf8');

content += `    phoneNumbers = JSON.parse(phoneNumbersRaw);
  } catch (e) {
    phoneNumbers = [phoneNumbersRaw];
  }

  // Simulate SSE dispatch (simplified)
  res.write(\`data: \${JSON.stringify({ status: 'Starting bulk campaign' })}\\n\\n\`);
  setTimeout(() => res.end(), 2000);
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();
`;

fs.writeFileSync('server.ts', content);
