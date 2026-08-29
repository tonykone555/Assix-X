export default function Test() {
  return (
    /* GLOBAL CENTRALIZED PROSPECT DATABASE / ARCHIVE */
    <div
      className={`flex-1 flex flex-col overflow-hidden p-6 shrink-0 rounded-[28px] border shadow-2xl ${isLight ? "bg-white/95 backdrop-blur-xl border-white/80 text-slate-900" : "bg-gradient-to-br from-[#0C0E14] via-[#121620] to-[#090A0E] text-[#F5F5F5] border-white/10"}`}
    >
      <header
        className={`flex flex-col gap-3 border-b pb-5 shrink-0 select-none ${isLight ? "border-slate-200" : "border-[#1A1A1A]"}`}
      >
        {/* Top Row: Title on Left, Action Buttons on Right */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[8px] tracking-[0.16em] text-[#52525B] font-bold uppercase select-none">
              CENTRALIZED CLOUD ARCHIVE
            </div>
            <h2
              className={`text-sm font-extrabold tracking-widest uppercase mt-0.5 flex items-center gap-2 ${isLight ? "text-slate-900" : "text-[#F5F5F5]"}`}
            >
              <Database size={14} className="text-[#7C5335]" /> Lead Generation
              Prospect Database
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 max-w-full">
            <button
              onClick={() => {
                setAutoOpenEmailBulkModal(true);
                setTab("email_campaign");
                showNotification("Opening Bulk Email Campaign Dispatcher...");
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[9px] tracking-widest uppercase rounded shadow-sm transition cursor-pointer select-none"
              title="Launch bulk email campaign for prospect leads"
            >
              <Rocket size={11} /> Bulk Email Campaign
            </button>

            <div className="flex items-center gap-1.5">
              <label className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-[9px] font-extrabold tracking-widest uppercase rounded shadow-sm transition cursor-pointer select-none">
                <Upload size={10} /> Upload CSV
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvContactUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setImportTabMode("paste");
                  setCsvModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#7C5335] hover:border-[#8d603e] bg-[#7C5335] hover:bg-[#8d603e] text-white text-[9px] font-extrabold tracking-widest uppercase rounded shadow-sm transition cursor-pointer select-none"
                title="Paste raw contact text block, messy list, or Zillow export to extract contacts with AI"
              >
                <FileText size={10} /> Paste Text / AI Import
              </button>
            </div>
          </div>
        </div>

        {/* INSTANT WEBSITE SCRAPE & CLONE PIPELINE */}
        <div
          className={`mt-2.5 p-2.5 rounded-lg border transition-all ${
            isLight
              ? "bg-[#F9FAFB] border-slate-200"
              : "bg-[#0b0b10] border-white/[0.03]"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-500 shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-200">
                Website Cloner & Scraper
              </span>
            </div>
            <span className="text-[8px] text-zinc-500 font-medium hidden sm:inline">
              Scrape & restructure with luxury theme
            </span>
          </div>

          <form onSubmit={handleScrapeToLead} className="flex gap-1.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500">
                <Globe size={10} />
              </div>
              <input
                type="text"
                value={scrapeUrlInput}
                onChange={(e) => setScrapeUrlInput(e.target.value)}
                disabled={isScrapingToLead}
                placeholder="Paste any URL to clone (e.g. cabinetdentaireparis.fr)..."
                className={`w-full pl-7 pr-2.5 py-1 text-[10px] rounded-md border outline-none transition-all ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-900 focus:border-[#7C5335]"
                    : "bg-[#040406] border-white/[0.05] text-white focus:border-amber-500"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isScrapingToLead || !scrapeUrlInput.trim()}
              className={`px-3 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 transition shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                isLight
                  ? "bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black"
              }`}
            >
              {isScrapingToLead ? (
                <RefreshCw size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} />
              )}
              <span>{isScrapingToLead ? "Scraping..." : "Clone"}</span>
            </button>
          </form>

          {isScrapingToLead && scrapeStatusText && (
            <div className="mt-1 flex items-center gap-1 animate-pulse">
              <span className="relative flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-amber-500"></span>
              </span>
              <span
                className={`text-[8px] font-mono font-bold uppercase tracking-wider ${isLight ? "text-[#7C5335]" : "text-amber-400"}`}
              >
                {scrapeStatusText}
              </span>
            </div>
          )}
        </div>

        {/* Persistent IG Discovery Style Prospect Segment Filter Bar & Simple Draw-Down */}
        <div className="flex flex-col gap-2 select-none max-w-full">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full">
            <button
              onClick={() => setLeadsFilterPopupOpen(!leadsFilterPopupOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-wider transition cursor-pointer shadow-xs ${
                leadsFilterPopupOpen
                  ? "bg-[#7C5335] text-white border-[#7C5335] shadow-md ring-1 ring-[#7C5335]/50"
                  : isLight
                    ? "bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300"
                    : "bg-[#14141E] hover:bg-[#1E1E2C] text-zinc-300 border-[#2A2A38]"
              }`}
            >
              <Sliders
                size={12}
                className={
                  leadsFilterPopupOpen ? "text-white" : "text-[#7C5335]"
                }
              />
              <span>Filter Prospects</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${leadsFilterPopupOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className="h-4 w-px bg-zinc-700/40 my-auto shrink-0" />

            {/* Quick filter pills */}
            {[
              { id: "all", label: "All", count: leads.length },
              {
                id: "no-website",
                label: "No Website",
                count: leads.filter(isNoWebsiteLead).length,
              },
              {
                id: "has-website",
                label: "Has Website",
                count: leads.filter((l) => !isNoWebsiteLead(l)).length,
              },
              {
                id: "whatsapp",
                label: "WhatsApp",
                count: leads.filter(isWhatsAppLead).length,
              },
              {
                id: "non-whatsapp",
                label: "Phone",
                count: leads.filter(
                  (l) =>
                    !isWhatsAppLead(l) && Boolean(l.phone || l.secondaryPhone),
                ).length,
              },
            ].map((item) => {
              const isSelected = leadsFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setLeadsFilter(item.id as any)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8.5px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                    isSelected
                      ? "bg-[#7C5335] text-white border-[#7C5335] shadow-sm"
                      : isLight
                        ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-[#0F0F12] hover:bg-[#1A1A22] text-zinc-300 border-[#272738]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`px-1 rounded-full font-mono text-[8px] font-bold ${
                      isSelected
                        ? "bg-black/30 text-white"
                        : isLight
                          ? "bg-slate-100 text-slate-600"
                          : "bg-[#1E1E2C] text-zinc-400"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}

            {/* Source Campaign Dropdown Selector */}
            <div className="flex items-center gap-1.5 ml-auto pl-4 shrink-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                Campaign Source:
              </span>
              <select
                value={activeTask?.taskId || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") {
                    selectTask({ taskId: "" } as any, false);
                  } else {
                    const matched = tasks.find((t) => t.taskId === val);
                    if (matched) selectTask(matched, false);
                  }
                }}
                className={`text-[9px] font-extrabold uppercase tracking-wider border rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${
                  isLight
                    ? "bg-white border-slate-300 text-slate-800 focus:border-[#7C5335]"
                    : "bg-[#14141E] border-[#2A2A38] text-amber-400 focus:border-amber-500"
                }`}
              >
                <option value="all">📂 ALL CAMPAIGNS & RUNS</option>
                {tasks
                  .filter(
                    (t) =>
                      t.taskType === "lead_generation" ||
                      t.taskType === "google_maps_scrape" ||
                      t.taskType === "csv_import" ||
                      t.taskType === "pages_jaunes_scrape" ||
                      t.taskType === "sirene" ||
                      (t.taskType && !["chat", "system"].includes(t.taskType)),
                  )
                  .map((t, idx) => (
                    <option key={t.taskId || idx} value={t.taskId}>
                      📁 {t.label || t.taskId || "Sourcing Run"} ({t.progress}/
                      {t.total})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Simple Inline Draw-Down Panel */}
          {leadsFilterPopupOpen && (
            <div
              className={`p-4 rounded-xl border shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
                isLight
                  ? "bg-slate-100 border-slate-300 text-slate-900"
                  : "bg-[#0F0F14] border-[#272738] text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-zinc-700/30 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7C5335] flex items-center gap-1.5">
                  <Sliders size={12} /> Prospect Segment Drawer
                </span>
                <button
                  onClick={() => setLeadsFilterPopupOpen(false)}
                  className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "all",
                    label: "All Prospects",
                    desc: "Complete lead directory",
                    count: leads.length,
                    icon: Database,
                  },
                  {
                    id: "no-website",
                    label: "No Website",
                    desc: "Prime targets for web dev pitch",
                    count: leads.filter(isNoWebsiteLead).length,
                    icon: Globe,
                  },
                  {
                    id: "has-website",
                    label: "Has Website",
                    desc: "Targets for audit & redesign",
                    count: leads.filter((l) => !isNoWebsiteLead(l)).length,
                    icon: Globe,
                  },
                  {
                    id: "whatsapp",
                    label: "WhatsApp Direct",
                    desc: "Phone numbers ready for chat",
                    count: leads.filter(isWhatsAppLead).length,
                    icon: MessageSquare,
                  },
                  {
                    id: "non-whatsapp",
                    label: "Standard Phone",
                    desc: "Cold calling & SMS outreach",
                    count: leads.filter(
                      (l) =>
                        !isWhatsAppLead(l) &&
                        Boolean(l.phone || l.secondaryPhone),
                    ).length,
                    icon: Phone,
                  },
                  {
                    id: "facebook_ads",
                    label: "FB Ads Active",
                    desc: "Running active paid campaigns",
                    count: 0,
                    icon: Share2,
                  },
                  {
                    id: "facebook_groups",
                    label: "FB Groups Scraped",
                    desc: "Extracted from group discussions",
                    count: 0,
                    icon: Users,
                  },
                ].map((item) => {
                  const isSelected = leadsFilter === item.id;
                  const ItemIcon = item.icon || Database;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setLeadsFilter(item.id as any);
                      }}
                      className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer ${
                        isSelected
                          ? "bg-[#7C5335] text-white border-[#7C5335] shadow-md ring-1 ring-[#7C5335]/50"
                          : isLight
                            ? "bg-white hover:bg-slate-200 text-slate-800 border-slate-200"
                            : "bg-[#15151F] hover:bg-[#1E1E2C] text-zinc-200 border-[#282838]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <ItemIcon
                          size={14}
                          className={
                            isSelected ? "text-white" : "text-[#7C5335]"
                          }
                        />
                        {item.count !== null && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold ${
                              isSelected
                                ? "bg-black/30 text-white"
                                : isLight
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-[#09090D] text-zinc-400"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span
                        className={`text-[8.5px] font-medium mt-0.5 ${isSelected ? "text-white/80" : "text-zinc-500"}`}
                      >
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="py-4 flex flex-wrap items-center gap-3 shrink-0 select-none">
        <input
          type="text"
          value={leadsSearch}
          onChange={(e) => setLeadsSearch(e.target.value)}
          placeholder="Filter leads by Business Name, City, Sector, or Phone..."
          className="flex-1 min-w-[220px] bg-[#0F0F11] border border-[#222] text-[#F5F5F5] rounded px-4 py-2 text-xs outline-none focus:border-[#7C5335] transition placeholder-[#52525B]"
        />

        {/* Sort Order Selector */}
        <div className="flex items-center gap-1.5 bg-[#0F0F11] border border-[#222] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase shrink-0">
          <span className="text-[#52525B]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[#F5F5F5] outline-none cursor-pointer font-bold uppercase focus:text-amber-400"
          >
            <option value="last_added" className="bg-[#0F0F11] text-white">
              Last Added (Newest)
            </option>
            <option value="oldest" className="bg-[#0F0F11] text-white">
              Oldest First
            </option>
            <option value="name_asc" className="bg-[#0F0F11] text-white">
              Name (A-Z)
            </option>
            <option value="gap_score" className="bg-[#0F0F11] text-white">
              Highest Gap Score
            </option>
          </select>
        </div>

        {/* Filter by WhatsApp Status */}
        <div className="flex items-center gap-1.5 bg-[#0F0F11] border border-[#222] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase shrink-0">
          <Phone size={11} className="text-emerald-400" />
          <span className="text-[#52525B]">WhatsApp:</span>
          <select
            value={filterWhatsApp}
            onChange={(e) => setFilterWhatsApp(e.target.value as any)}
            className="bg-transparent text-[#F5F5F5] outline-none cursor-pointer font-bold uppercase focus:text-emerald-400"
          >
            <option value="all" className="bg-[#0F0F11] text-white">
              All Numbers
            </option>
            <option
              value="whatsapp"
              className="bg-[#0F0F11] text-emerald-400 font-bold"
            >
              WhatsApp Only
            </option>
            <option value="non-whatsapp" className="bg-[#0F0F11] text-white">
              Non-WhatsApp
            </option>
            <option value="no-phone" className="bg-[#0F0F11] text-zinc-500">
              No Phone
            </option>
          </select>
        </div>

        {/* Filter by Day / Date Range */}
        <div className="flex items-center gap-1.5 bg-[#0F0F11] border border-[#222] px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase shrink-0">
          <Calendar size={11} className="text-[#7C5335]" />
          <span className="text-[#52525B]">Day:</span>
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="bg-transparent text-[#F5F5F5] outline-none cursor-pointer font-bold uppercase focus:text-amber-400"
          >
            <option value="any" className="bg-[#0F0F11] text-white">
              All Time
            </option>
            <option value="today" className="bg-[#0F0F11] text-white">
              Today Only
            </option>
            <option value="yesterday" className="bg-[#0F0F11] text-white">
              Yesterday
            </option>
            <option value="last7" className="bg-[#0F0F11] text-white">
              Past 7 Days
            </option>
            <option value="last30" className="bg-[#0F0F11] text-white">
              Past 30 Days
            </option>
          </select>
        </div>

        {/* Specific Date Picker */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="date"
            value={filterSpecificDate}
            onChange={(e) => setFilterSpecificDate(e.target.value)}
            className="bg-[#0F0F11] border border-[#222] text-[#F5F5F5] rounded-lg px-2.5 py-1.5 text-[10px] outline-none focus:border-[#7C5335] cursor-pointer"
            title="Filter by exact date (YYYY-MM-DD)"
          />
          {filterSpecificDate && (
            <button
              onClick={() => setFilterSpecificDate("")}
              className="text-zinc-400 hover:text-white text-[8px] font-bold uppercase bg-[#121215] border border-[#222] px-2 py-1.5 rounded transition cursor-pointer"
              title="Clear specific date filter"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#0F0F11] border border-[#222] p-1 rounded-lg select-none shrink-0">
          <button
            onClick={() => setLeadsViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition cursor-pointer text-[9px] font-bold uppercase tracking-wider ${leadsViewMode === "cards" ? "bg-[#3E2723] border border-[#5D4037] text-white shadow-md shadow-[#3E2723]/30" : "text-[#71717A] hover:text-white bg-transparent"}`}
            title="Grid View"
          >
            <LayoutGrid size={12} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setLeadsViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition cursor-pointer text-[9px] font-bold uppercase tracking-wider ${leadsViewMode === "table" ? "bg-[#3E2723] border border-[#5D4037] text-white shadow-md shadow-[#3E2723]/30" : "text-[#71717A] hover:text-white bg-transparent"}`}
            title="List / Table View"
          >
            <List size={12} />
            <span>List</span>
          </button>
        </div>

        <button
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-[9px] font-bold tracking-widest uppercase transition cursor-pointer shrink-0 ${filterPanelOpen ? "bg-red-950/30 border-red-500/50 text-red-400" : "border-[#222225] text-zinc-400 hover:text-white hover:border-zinc-700 bg-[#0F0F11]"}`}
          title="Toggle Filter Panel"
        >
          <Sliders size={12} /> Filters
        </button>
      </div>

      {/* Multi-Action Lead Selection Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="mb-6 p-4 bg-[#0F0F12] border border-[#27272A] rounded-xl shadow-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white border border-red-300 text-red-600 text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <CheckCircle size={14} className="text-red-600" />
              <span>
                {selectedLeadIds.length} Lead
                {selectedLeadIds.length > 1 ? "s" : ""} Selected
              </span>
            </div>

            {/* Select All / Deselect All Toggle */}
            <button
              onClick={() => {
                const allSelected =
                  filteredLeads.length > 0 &&
                  filteredLeads.every((l) =>
                    selectedLeadIds.includes(l.leadId),
                  );
                if (allSelected) {
                  const filteredIds = filteredLeads.map((l) => l.leadId);
                  setSelectedLeadIds((prev) =>
                    prev.filter((id) => !filteredIds.includes(id)),
                  );
                } else {
                  const newIds = filteredLeads
                    .map((l) => l.leadId)
                    .filter(Boolean);
                  setSelectedLeadIds((prev) =>
                    Array.from(new Set([...prev, ...newIds])),
                  );
                }
              }}
              className="px-3 py-1 bg-[#1A1A1E] hover:bg-[#25252A] text-zinc-300 hover:text-white border border-zinc-700 text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckSquare size={12} />
              <span>
                {filteredLeads.length > 0 &&
                filteredLeads.every((l) => selectedLeadIds.includes(l.leadId))
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Enrich Selected Leads */}
            <button
              onClick={handleBatchEnrichLeads}
              disabled={isBatchEnriching}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/60 text-[10px] font-extrabold tracking-wider uppercase rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              title="Enrich selected leads"
            >
              {isBatchEnriching && (
                <RefreshCw size={12} className="animate-spin text-blue-300" />
              )}
              <span>
                {isBatchEnriching
                  ? `Enriching (${batchEnrichProgress.current}/${batchEnrichProgress.total})...`
                  : `Enrich Selected (${selectedLeadIds.length})`}
              </span>
            </button>

            {/* Remove Duplicates */}
            <button
              onClick={handleRemoveDuplicates}
              className="px-3.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              title="Detect and remove duplicate leads automatically"
            >
              <Layers size={12} className="text-amber-400" />
              <span>Remove Duplicates</span>
            </button>

            {/* Delete Selected Leads */}
            <button
              onClick={handleDeleteSelectedLeads}
              className="px-3.5 py-1.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              title="Delete selected leads permanently"
            >
              <Trash2 size={12} className="text-red-600" />
              <span>Delete Selected ({selectedLeadIds.length})</span>
            </button>

            {/* Singular WhatsApp direct message if 1 lead selected */}
            {selectedLeadIds.length === 1 &&
              (() => {
                const singleLead = leads.find((l) =>
                  selectedLeadIds.includes(l.leadId),
                );
                const phoneNum =
                  singleLead?.phone || singleLead?.secondaryPhone;
                if (!phoneNum) return null;
                return (
                  <a
                    href={`https://wa.me/${phoneNum.replace(/\D/g, "")}?text=${encodeURIComponent(
                      singleLead?.pitch && singleLead.pitch.length > 20
                        ? singleLead.pitch
                        : `Bonjour ${singleLead?.name || singleLead?.businessName || ""}, je suis tombé sur ${singleLead?.businessName || singleLead?.name || "votre établissement"} et j'ai remarqué que votre site web pourrait bénéficier d'une modernisation pour booster vos conversions clients. Seriez-vous ouvert à l'idée de découvrir une maquette gratuite ?`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-black hover:bg-zinc-900 text-[#10B981] hover:text-[#25D366] border border-[#10B981]/40 hover:border-[#10B981] font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare size={12} className="text-[#10B981]" />
                    <span>Send Direct WhatsApp</span>
                  </a>
                );
              })()}

            {/* Verify WhatsApp Accounts */}
            <button
              onClick={async () => {
                showNotification(
                  `Analyzing ${selectedLeadIds.length} phone numbers for active WhatsApp accounts...`,
                );
                try {
                  const res = await fetch("/api/whatsapp/verify-leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ leadIds: selectedLeadIds }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    showNotification(
                      `WhatsApp Verification Done: ${data.verifiedWhatsappCount} of ${data.totalChecked} leads have active WhatsApp accounts!`,
                    );
                    fetchLeads();
                  } else {
                    showNotification(`Notice: ${data.error}`);
                  }
                } catch (err: any) {
                  showNotification(`Verification error: ${err.message}`);
                }
              }}
              className="px-3.5 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              title="Analyze phone numbers and verify live active WhatsApp accounts"
            >
              <ShieldCheck size={12} className="text-[#10B981]" />
              <span>Verify WhatsApp ({selectedLeadIds.length})</span>
            </button>

            {/* Add to WhatsApp Bulk Outreach */}
            <button
              onClick={() => setTab("whatsapp")}
              className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 border border-[#10B981]/40 text-[#10B981] hover:text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              title="Open WhatsApp Outreach Tab with selected leads"
            >
              <MessageSquare size={12} className="text-[#10B981]" />
              <span>Add to WhatsApp Bulk ({selectedLeadIds.length})</span>
            </button>

            {/* Bulk Email Campaign for Selected Leads */}
            <button
              onClick={() => {
                setAutoOpenEmailBulkModal(true);
                setTab("email_campaign");
                showNotification(
                  `Loaded ${selectedLeadIds.length} selected leads into Bulk Email Campaign`,
                );
              }}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              title="Open Bulk Email Campaign Dispatcher with selected leads"
            >
              <Rocket size={12} />
              <span>Bulk Email Campaign ({selectedLeadIds.length})</span>
            </button>

            {/* Generate AI Website */}
            <button
              onClick={() => {
                const firstSelected = leads.find((l) =>
                  selectedLeadIds.includes(l.leadId),
                );
                if (firstSelected) setNestaModalLead(firstSelected);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5 border border-zinc-300"
            >
              <Sparkles size={12} />
              <span>Generate AI Site</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-[#52525B] text-xs font-semibold select-none uppercase tracking-widest bg-[#0A0A0A] border border-[#1A1A1A] rounded">
            No target records matched query filters.
          </div>
        ) : leadsViewMode === "table" ? (
          <div
            className={`rounded-2xl overflow-x-auto p-4 transition-all duration-300 border backdrop-blur-xl ${
              isLight
                ? "bg-white/60 border-slate-200 shadow-md ring-1 ring-slate-100 hover:border-slate-300"
                : "bg-gradient-to-b from-[#0e1017]/90 via-[#0a0b10]/80 to-[#07080c]/90 border-white/[0.06] shadow-2xl ring-1 ring-white/5 hover:border-white/10"
            }`}
          >
            <table className="w-full text-xs text-left select-text font-sans border-separate border-spacing-y-2.5">
              <thead
                className={`text-[8.5px] tracking-widest uppercase font-black select-none ${
                  isLight
                    ? "bg-slate-200/60 text-blue-800"
                    : "bg-[#0D0F18] text-blue-400"
                }`}
              >
                <tr className="rounded-xl">
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider w-12 text-center select-none rounded-l-xl">
                    <input
                      type="checkbox"
                      checked={
                        filteredLeads.length > 0 &&
                        filteredLeads.every((l) =>
                          selectedLeadIds.includes(l.leadId),
                        )
                      }
                      onChange={() => {
                        const allSelected = filteredLeads.every((l) =>
                          selectedLeadIds.includes(l.leadId),
                        );
                        if (allSelected) {
                          const filteredIds = filteredLeads.map(
                            (l) => l.leadId,
                          );
                          setSelectedLeadIds((prev) =>
                            prev.filter((id) => !filteredIds.includes(id)),
                          );
                        } else {
                          setSelectedLeadIds((prev) => {
                            const newIds = filteredLeads
                              .map((l) => l.leadId)
                              .filter(Boolean);
                            return Array.from(new Set([...prev, ...newIds]));
                          });
                        }
                      }}
                      className="bg-zinc-900 border-zinc-700 rounded text-[#7C5335] focus:ring-[#7C5335] w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Business / Firm
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Phone / WhatsApp
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Website URL
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Social Links
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Rating & Reviews
                  </th>
                  <th className="px-6 py-3.5 font-black uppercase tracking-wider">
                    Website AI
                  </th>
                  <th className="px-4 py-3.5 font-black uppercase tracking-wider text-center rounded-r-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, idx) => {
                  const isSelected = selectedLeadIds.includes(lead.leadId);
                  return (
                    <LeadRow
                      key={lead.leadId || `lead-row-${idx}`}
                      lead={lead}
                      idx={idx}
                      isLight={isLight}
                      isSelected={isSelected}
                      onSelectToggle={(id) => {
                        setSelectedLeadIds((prev) =>
                          prev.includes(id)
                            ? prev.filter((item) => item !== id)
                            : [...prev, id],
                        );
                      }}
                      onPushLead={handlePushLead}
                      isPushing={pushingLeadId === lead.leadId}
                      onSkip={handleSkipLead}
                      onGenerateWebsite={(l) => setNestaModalLead(l)}
                      onEnrichLead={handleEnrichLead}
                      isEnriching={Boolean(
                        enrichingLeadIds[lead.leadId || (lead as any).id],
                      )}
                      serverUrl={serverUrl}
                      onOpenInbox={handleOpenInboxForLead}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12">
            {filteredLeads.map((lead, idx) => (
              <LeadCard
                key={lead.leadId || `lead-card-${idx}`}
                lead={lead}
                leadNumber={idx + 1}
                onPushLead={handlePushLead}
                isPushing={pushingLeadId === lead.leadId}
                serverUrl={serverUrl}
                onSkip={handleSkipLead}
                onGenerateWebsite={(l) => setNestaModalLead(l)}
                onEnrichLead={handleEnrichLead}
                isEnriching={Boolean(
                  enrichingLeadIds[lead.leadId || (lead as any).id],
                )}
                selected={selectedLeadIds.includes(lead.leadId)}
                onSelectToggle={(id) => {
                  setSelectedLeadIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((item) => item !== id)
                      : [...prev, id],
                  );
                }}
                onOpenInbox={handleOpenInboxForLead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
