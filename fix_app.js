const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetText = "searchEngine === 'apify' ? '";
const index = content.indexOf(targetText);

if (index !== -1) {
  let cleanContent = content.substring(0, index + targetText.length);
  // Complete the ternary
  cleanContent += "⚡ Apify Actor' : 'Google Maps'}</span>\n" +
  "                                  </div>\n" +
  "                                </div>\n" +
  "                              </div>\n" +
  "                            </div>\n" +
  "                          </div>\n" +
  "                        )}\n" +
  "                      </div>\n" +
  "                    )}\n" +
  "                  </div>\n" +
  "                </div>\n" +
  "              )}\n" +
  "            </div>\n" +
  "          </div>\n" +
  "        </div>\n" +
  "      </div>\n" +
  "    </div>\n" +
  "  );\n" +
  "}\n" +
  "export default App;\n";

  fs.writeFileSync('src/App.tsx', cleanContent);
}
