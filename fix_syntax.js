const fs = require('fs');
let content = fs.readFileSync('src/components/NestaWebsiteModal.tsx', 'utf8');

// The issue is I have unmatched <> because the closeTags replacement failed.
// Let's find exactly where to insert </>}
const searchStr = `                  <span className="truncate">{p.title || \`Portfolio #\${idx + 1}\`}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>`;

const replaceStr = `                  <span className="truncate">{p.title || \`Portfolio #\${idx + 1}\`}</span>
                </button>
              ))}
            </>
          )}
          </>
        )}
        </div>
      </div>`;

content = content.replace(searchStr, replaceStr);

fs.writeFileSync('src/components/NestaWebsiteModal.tsx', content);
