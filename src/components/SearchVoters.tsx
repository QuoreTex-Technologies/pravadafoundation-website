import React, { useState, useEffect, useRef } from 'react';
import {
  getVoterOptions,
  searchEcVoters,
  searchAllDistricts,
  FALLBACK_OPTIONS,
  getVoterExportPdfUrl,
} from '../services/voterApi';
import type {
  VoterOptionsData,
  ApiVoterRecord,
} from '../services/voterApi';
import '../App.css';

export type VoterRecord = ApiVoterRecord;

interface SearchVotersProps {
  onBackToHome?: () => void;
}

interface ActiveSearchParams {
  electorName?: string;
  partNo?: string;
  districtId?: string;
  talukaId?: string;
  instituteName?: string;
  isAllDistricts?: boolean;
}

export const SearchVoters: React.FC<SearchVotersProps> = ({ onBackToHome }) => {
  // Store initial options for clean reset
  const initialOptionsRef = useRef<VoterOptionsData>(FALLBACK_OPTIONS);

  // API Options state (districts, talukas, institutes)
  const [options, setOptions] = useState<VoterOptionsData>(FALLBACK_OPTIONS);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);
  const [isLoadingDependent, setIsLoadingDependent] = useState<boolean>(false);

  // Form input states
  const [nameInput, setNameInput] = useState<string>('');
  const [boothInput, setBoothInput] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedTalukaId, setSelectedTalukaId] = useState<string>('');
  const [selectedInstitute, setSelectedInstitute] = useState<string>('');

  // Search execution & pagination state
  const [voters, setVoters] = useState<VoterRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeFilterLabel, setActiveFilterLabel] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  // Active query tracker for pagination
  const [activeQuery, setActiveQuery] = useState<ActiveSearchParams | null>(null);

  // Poster modal view state
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false);

  // -------------------------------------------------------------
  // Initial Mount: Load Options from GET /api/public/ec-voters/options
  // -------------------------------------------------------------
  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialOptions() {
      setIsLoadingOptions(true);
      try {
        const { options: fetchedOptions } = await getVoterOptions();
        if (isSubscribed) {
          initialOptionsRef.current = fetchedOptions;
          setOptions(fetchedOptions);
        }
      } catch (err: any) {
        if (isSubscribed) {
          console.warn('[SearchVoters] Error loading initial options:', err);
          setGeneralError('Failed to load filter options. Please refresh the page.');
        }
      } finally {
        if (isSubscribed) {
          setIsLoadingOptions(false);
        }
      }
    }

    loadInitialOptions();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // -------------------------------------------------------------
  // Dropdown Change Handlers
  // -------------------------------------------------------------
  const handleDistrictChange = async (distId: string) => {
    setSelectedDistrictId(distId);
    setSelectedTalukaId('');
    setSelectedInstitute('');
    setGeneralError('');

    if (!distId) {
      setOptions((prev) => ({
        ...prev,
        talukas: initialOptionsRef.current.talukas,
        institutes: initialOptionsRef.current.institutes,
      }));
      return;
    }

    setIsLoadingDependent(true);
    try {
      const { options: dependentOptions } = await getVoterOptions(distId);
      setOptions((prev) => ({
        ...prev,
        talukas: dependentOptions.talukas,
        institutes:
          dependentOptions.institutes && dependentOptions.institutes.length > 0
            ? dependentOptions.institutes
            : initialOptionsRef.current.institutes,
      }));
    } catch (err) {
      console.warn('[SearchVoters] Failed to load dependent options for district:', err);
    } finally {
      setIsLoadingDependent(false);
    }
  };

  const handleTalukaChange = async (talId: string) => {
    setSelectedTalukaId(talId);
    setSelectedInstitute('');
    setGeneralError('');

    if (!talId) {
      // If taluka is reset to 'All', restore initial institutes
      setOptions((prev) => ({
        ...prev,
        institutes: initialOptionsRef.current.institutes,
      }));
      return;
    }

    // Auto-detect district if none was selected
    let effectiveDistrictId = selectedDistrictId;
    if (!effectiveDistrictId) {
      const matched = options.talukas.find((t) => String(t.id) === String(talId));
      if (matched?.districtId) {
        effectiveDistrictId = String(matched.districtId);
        setSelectedDistrictId(effectiveDistrictId);
      }
    }

    setIsLoadingDependent(true);
    try {
      const { options: talukaOptions } = await getVoterOptions(effectiveDistrictId, talId);
      if (talukaOptions.institutes && talukaOptions.institutes.length > 0) {
        setOptions((prev) => ({
          ...prev,
          institutes: talukaOptions.institutes,
        }));
      }
    } catch (err) {
      console.warn('[SearchVoters] Failed to load institutes for taluka:', err);
    } finally {
      setIsLoadingDependent(false);
    }
  };

  const handleInstituteChange = (instName: string) => {
    setSelectedInstitute(instName);
    setGeneralError('');
  };

  // -------------------------------------------------------------
  // Common Unified Search Function
  // Combines Name, Booth Number, District, Taluka, Institute
  // -------------------------------------------------------------
  const handleUnifiedSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGeneralError('');
    setIsSearching(true);
    setHasSearched(true);

    const trimmedName = nameInput.trim();
    const trimmedBooth = boothInput.trim();

    const isAllDistricts =
      !selectedDistrictId &&
      !selectedTalukaId &&
      !selectedInstitute &&
      !trimmedName &&
      !trimmedBooth;

    const distName = options.districts.find((d) => String(d.id) === String(selectedDistrictId))?.name;
    const talName = options.talukas.find((t) => String(t.id) === String(selectedTalukaId))?.name;

    const labelParts = [
      trimmedName ? `Name: "${trimmedName}"` : null,
      trimmedBooth ? `Booth: ${trimmedBooth}` : null,
      distName ? `District: ${distName}` : null,
      talName ? `Taluka: ${talName}` : null,
      selectedInstitute ? `Institute: ${selectedInstitute}` : null,
    ].filter(Boolean);

    const label = labelParts.length > 0 ? labelParts.join(' · ') : 'All Districts (All Voters)';
    setActiveFilterLabel(label);

    const queryParams: ActiveSearchParams = {
      electorName: trimmedName || undefined,
      partNo: trimmedBooth || undefined,
      districtId: selectedDistrictId || undefined,
      talukaId: selectedTalukaId || undefined,
      instituteName: selectedInstitute || undefined,
      isAllDistricts,
    };
    setActiveQuery(queryParams);

    try {
      let res;
      if (isAllDistricts) {
        const districtIds = options.districts.map((d) => d.id);
        res = await searchAllDistricts(districtIds, 0, 10);
      } else {
        res = await searchEcVoters({
          electorName: trimmedName || undefined,
          partNo: trimmedBooth || undefined,
          districtId: selectedDistrictId || undefined,
          talukaId: selectedTalukaId || undefined,
          instituteName: selectedInstitute || undefined,
          page: 0,
          size: 25,
        });
      }

      if (res.isLiveApi) {
        setVoters(res.records);
        setTotalCount(res.totalElements);
        setTotalPages(res.totalPages);
        setCurrentPage(0);
      } else {
        setVoters([]);
        setTotalCount(0);
        setTotalPages(0);
        setCurrentPage(0);
        if (res.error) setGeneralError(res.error);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to search voters.');
      setVoters([]);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  };

  // -------------------------------------------------------------
  // Common Reset Function
  // -------------------------------------------------------------
  const handleReset = () => {
    setNameInput('');
    setBoothInput('');
    setGeneralError('');
    setSelectedDistrictId('');
    setSelectedTalukaId('');
    setSelectedInstitute('');
    setOptions(initialOptionsRef.current);
    setVoters([]);
    setTotalCount(0);
    setTotalPages(0);
    setCurrentPage(0);
    setHasSearched(false);
    setActiveQuery(null);
    setActiveFilterLabel('');
  };

  // -------------------------------------------------------------
  // Page Navigation Flow (Proper Pagination)
  // -------------------------------------------------------------
  const resultsTopRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = async (targetPage: number) => {
    if (
      !activeQuery ||
      isSearching ||
      targetPage < 0 ||
      targetPage >= totalPages ||
      targetPage === currentPage
    ) {
      return;
    }

    setIsSearching(true);

    try {
      let res;
      if (activeQuery.isAllDistricts) {
        const districtIds = options.districts.map((d) => d.id);
        res = await searchAllDistricts(districtIds, targetPage, 10);
      } else {
        res = await searchEcVoters({
          electorName: activeQuery.electorName,
          partNo: activeQuery.partNo,
          districtId: activeQuery.districtId,
          talukaId: activeQuery.talukaId,
          instituteName: activeQuery.instituteName,
          page: targetPage,
          size: 25,
        });
      }

      if (res.isLiveApi && res.records.length > 0) {
        setVoters(res.records);
        setCurrentPage(targetPage);
        setTotalCount(res.totalElements);
        setTotalPages(res.totalPages);

        if (resultsTopRef.current) {
          resultsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      console.warn('[SearchVoters] Page change error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const getPaginationItems = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push('ellipsis-start');
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('ellipsis-end');
      }

      pages.push(totalPages - 1);
    }
    return pages;
  };

  // -------------------------------------------------------------
  // Export PDF API Call
  // Calls GET https://api.mishikshak.quore-tex.com/api/public/ec-voters/export/pdf?districtId=...&talukaId=...&instituteName=...
  // -------------------------------------------------------------
  const handleExportPdf = async () => {
    const matchedInst = options.institutes.find((i) => i.name === selectedInstitute);
    const distId = selectedDistrictId || activeQuery?.districtId || matchedInst?.districtId || '32';

    let talId = selectedTalukaId || activeQuery?.talukaId;
    if (!talId) {
      const firstTaluka = options.talukas.find(
        (t) => !t.districtId || String(t.districtId) === String(distId)
      );
      talId = firstTaluka ? String(firstTaluka.id) : '21';
    }

    const instName = (selectedInstitute || activeQuery?.instituteName || '').trim();
    const elector = (nameInput || activeQuery?.electorName || '').trim();
    const part = (boothInput || activeQuery?.partNo || '').trim();

    const exportUrl = getVoterExportPdfUrl({
      districtId: distId,
      talukaId: talId,
      instituteName: instName,
      electorName: elector,
      partNo: part,
    });

    setIsExportingPdf(true);
    try {
      const res = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf, application/octet-stream, */*',
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size === 0) {
          throw new Error('Received empty PDF file');
        }
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const cleanInst = instName
          ? `-${instName.replace(/[^a-zA-Z0-9_\-\u0900-\u097F]/g, '_').slice(0, 30)}`
          : '';
        link.download = `voters-district-${distId}-taluka-${talId}${cleanInst}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      } else {
        // Direct open fallback if backend requires direct browser session or is in streaming mode
        window.open(exportUrl, '_blank');
      }
    } catch (err) {
      console.warn('[SearchVoters] Direct download fallback triggered:', err);
      window.open(exportUrl, '_blank');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="voter-portal">
      {/* Attractive Election Campaign Hero Header */}
      <header className="voter-campaign-hero">
        <div className="voter-campaign-hero__ambient" aria-hidden="true" />

        {/* Main Campaign Hero Content */}
        <div className="container voter-campaign-hero__content">
          <div className="voter-campaign-hero__actions">
            <button
              type="button"
              className="voter-portal__tool"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              title="Export voter list as PDF from API"
            >
              {isExportingPdf ? (
                <i className="fa fa-spinner fa-spin" aria-hidden="true" />
              ) : (
                <i className="fa fa-file-pdf" aria-hidden="true" />
              )}
              <span>{isExportingPdf ? 'Downloading PDF...' : 'Print / PDF'}</span>
            </button>
            {onBackToHome && (
              <button
                type="button"
                className="voter-portal__tool voter-portal__tool--muted"
                onClick={onBackToHome}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
                <span>Back to Home</span>
              </button>
            )}
          </div>

          <div className="campaign-showcase">
            {/* Candidate Identity */}
            <div className="campaign-candidate">
              <div className="campaign-candidate__photo-wrap">
                <img
                  src="/img/shrikant_deshpande_avatar.png"
                  alt="Dr. Shrikant Govind Deshpande"
                  className="campaign-candidate__photo"
                  width={72}
                  height={72}
                />
                <div className="campaign-candidate__ring" aria-hidden="true" />
              </div>
              <div className="campaign-candidate__info">
                <div className="campaign-candidate__badge">
                  <i className="fa fa-graduation-cap" aria-hidden="true" />
                  <span>Amravati Division Teachers Constituency</span>
                </div>
                <h1 className="campaign-candidate__name">
                  डॉ. श्रीकांत गोविंद देशपांडे
                  <span className="campaign-candidate__name-en">Dr. Shrikant Govind Deshpande</span>
                </h1>
                <p className="campaign-candidate__tagline">
                  मतदार व मतदान केंद्र शोध प्रणाली · Voter &amp; Polling Booth Search Portal
                </p>
              </div>
            </div>

            {/* Official Ballot Slip Replica (मतपत्रिका नमुना) */}
            <div className="ballot-paper-card">
              <div className="ballot-slip">
                {/* Column 1: Serial No */}
                <div className="ballot-slip__col ballot-slip__serial">
                  <div className="ballot-slip__cell-mr">
                    <span className="ballot-slip__lbl">अनुक्रमांक</span>
                    <span className="ballot-slip__num">२१</span>
                  </div>
                  <div className="ballot-slip__cell-en">
                    <span className="ballot-slip__lbl">Serial No.</span>
                    <span className="ballot-slip__num">21</span>
                  </div>
                </div>

                {/* Column 2: Candidate Name */}
                <div className="ballot-slip__col ballot-slip__name">
                  <div className="ballot-slip__name-mr">डॉ. श्रीकांत गोविंद देशपांडे</div>
                  <div className="ballot-slip__name-en">Dr. Shrikant Govind Deshpande</div>
                </div>

                {/* Column 3: Candidate Photo */}
                <div className="ballot-slip__col ballot-slip__photo">
                  <div className="ballot-slip__photo-frame">
                    <img
                      src="/img/shrikant_deshpande_avatar.png"
                      alt="Dr. Shrikant Govind Deshpande"
                      width={44}
                      height={44}
                    />
                  </div>
                </div>

                {/* Column 4: Preference Marker Box */}
                <div className="ballot-slip__col ballot-slip__vote">
                  <div className="ballot-slip__vote-box" title="पसंती क्रमांक १ (Preference No. 1)">
                    <span className="ballot-slip__vote-mark">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="voter-portal__main">
        {/* Compact Single Unified Search & Filter Card */}
        <section className="voter-unified-card" aria-label="Search and Filter Voters">
          <div className="voter-unified-card__header">
            <h2 className="voter-unified-card__title">
              <i className="fa fa-magnifying-glass" aria-hidden="true" />
              Search &amp; Filter Voters
            </h2>
            <p className="voter-unified-card__desc">
              Search by voter name or booth number, and narrow down by District, Taluka, or Institute.
            </p>
          </div>

          <form onSubmit={handleUnifiedSearch}>
            {/* Row 1: Name and Booth Number */}
            <div className="voter-inputs-grid">
              {/* Search by Name */}
              <div className="voter-field">
                <label htmlFor="voter-name-input">
                  <span>
                    <i className="fa fa-user" aria-hidden="true" style={{ marginRight: '5px' }} />
                    Search by Name
                  </span>
                </label>
                <div className="voter-input-wrap">
                  <i className="fa fa-search icon-prefix" aria-hidden="true" />
                  <input
                    id="voter-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      const lettersOnly = e.target.value.replace(/[^a-zA-Z\s\u0900-\u097F]/g, '');
                      setNameInput(lettersOnly);
                    }}
                    placeholder="Enter voter name"
                    autoComplete="off"
                  />
                  {nameInput && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => setNameInput('')}
                      aria-label="Clear name"
                    >
                      <i className="fa fa-times" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search by Booth Number (Hash # icon removed) */}
              <div className="voter-field">
                <label htmlFor="voter-booth-input">
                  <span>
                    <i className="fa fa-landmark" aria-hidden="true" style={{ marginRight: '5px' }} />
                    Search by Booth Number
                  </span>
                </label>
                <div className="voter-input-wrap">
                  <input
                    id="voter-booth-input"
                    type="text"
                    value={boothInput}
                    onChange={(e) => setBoothInput(e.target.value)}
                    placeholder="Enter booth number"
                    autoComplete="off"
                  />
                  {boothInput && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => setBoothInput('')}
                      aria-label="Clear booth"
                    >
                      <i className="fa fa-times" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: District, Taluka, Institute Dropdowns */}
            <div className="voter-dropdowns-grid">
              {/* 1. District */}
              <div className="voter-field">
                <label htmlFor="filter-district">
                  <span>District</span>
                  {isLoadingOptions && <span className="field-badge">Loading...</span>}
                </label>
                <div className="voter-select-wrap">
                  <select
                    id="filter-district"
                    value={selectedDistrictId}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={isLoadingOptions || isSearching}
                  >
                    <option value="">All Districts</option>
                    {options.districts.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Taluka */}
              <div className="voter-field">
                <label htmlFor="filter-taluka">
                  <span>Taluka</span>
                  {isLoadingDependent && <span className="field-badge">Updating...</span>}
                </label>
                <div className="voter-select-wrap">
                  <select
                    id="filter-taluka"
                    value={selectedTalukaId}
                    onChange={(e) => handleTalukaChange(e.target.value)}
                    disabled={isLoadingDependent || isSearching}
                  >
                    <option value="">All Talukas</option>
                    {options.talukas.map((t) => (
                      <option key={String(t.id)} value={String(t.id)}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Institute */}
              <div className="voter-field">
                <label htmlFor="filter-institute">
                  <span>Institute</span>
                  {isLoadingDependent && <span className="field-badge">Updating...</span>}
                </label>
                <div className="voter-select-wrap">
                  <select
                    id="filter-institute"
                    value={selectedInstitute}
                    onChange={(e) => handleInstituteChange(e.target.value)}
                    disabled={isLoadingDependent || isSearching}
                  >
                    <option value="">
                      All Institutes {options.institutes.length > 0 ? `(${options.institutes.length})` : ''}
                    </option>
                    {options.institutes.map((inst) => (
                      <option key={String(inst.id)} value={inst.name}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Common Action Buttons: Search & Reset */}
            <div className="voter-actions-row">
              <button
                type="submit"
                className="voter-common-btn voter-common-btn--search"
                disabled={isSearching}
              >
                {isSearching ? (
                  <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                ) : (
                  <i className="fa fa-magnifying-glass" aria-hidden="true" />
                )}
                Search
              </button>
              <button
                type="button"
                className="voter-common-btn voter-common-btn--reset"
                onClick={handleReset}
                disabled={isSearching}
              >
                <i className="fa fa-rotate-left" aria-hidden="true" />
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Error Banner */}
        {generalError && (
          <div className="voter-banner-error" role="alert">
            <i className="fa fa-circle-exclamation" aria-hidden="true" />
            <div>
              <strong>Notice:</strong> {generalError}
            </div>
          </div>
        )}

        {/* Scroll anchor for pagination */}
        <div ref={resultsTopRef} />

        {/* Results Status Bar */}
        {hasSearched && !isSearching && (
          <div className="voter-status-bar">
            <span className="voter-status-count">
              <strong>{totalCount.toLocaleString()}</strong> voters found
            </span>
            {activeFilterLabel && (
              <span className="voter-active-filter-badge">
                <i className="fa fa-circle-check" aria-hidden="true" />
                {activeFilterLabel}
              </span>
            )}
          </div>
        )}

        {/* Searching Loading State */}
        {isSearching && (
          <div className="voter-state-card voter-state-card--loading">
            <i className="fa fa-spinner fa-spin state-icon" aria-hidden="true" />
            <h2>Searching voter records...</h2>
            <p>Please wait while we fetch the latest data from the registry.</p>
          </div>
        )}

        {/* Empty Search Results */}
        {!isSearching && hasSearched && voters.length === 0 && (
          <div className="voter-state-card voter-state-card--empty">
            <i className="fa fa-user-slash state-icon" aria-hidden="true" />
            <h2>No voters found.</h2>
            <p>
              No records matched your search criteria. Please try another name, booth number, or
              adjust your dropdown filters.
            </p>
            <button
              type="button"
              className="voter-common-btn voter-common-btn--reset"
              onClick={handleReset}
            >
              Clear Filters &amp; Try Again
            </button>
          </div>
        )}

        {/* Initial Prompt State (before any search is triggered) */}
        {!isSearching && !hasSearched && (
          <div className="voter-state-card">
            <i className="fa fa-search state-icon" aria-hidden="true" />
            <h2>Search or Filter Voters</h2>
            <p>
              Enter a voter name, booth number, or choose a District, Taluka, and
              Institute, then click Search to view the electoral roll.
            </p>
          </div>
        )}

        {/* Compact Voters List Grid (Without WhatsApp Button) */}
        {!isSearching && voters.length > 0 && (
          <>
            <ul className="voter-grid">
              {voters.map((item, idx) => (
                <li key={`${item.TeacherId}-${idx}`}>
                  <article className="voter-card">
                    <header className="voter-card__header">
                      {/* Sr. No label and number */}
                      <span className="voter-card__sr">Sr. No. {item.SrNo || idx + 1}</span>
                      <div className="voter-card__title-wrap">
                        <h2>{item.TeacherName}</h2>
                        <p className="voter-card__institute">{item.InstituteName || '—'}</p>
                      </div>
                    </header>

                    <div className="voter-card__chips">
                      {item.Age && item.Age !== '—' && (
                        <span className="voter-chip">Age: {item.Age}</span>
                      )}
                      {item.Gender && (
                        <span className="voter-chip voter-chip--gender">{item.Gender}</span>
                      )}
                      {item.BoothNo && (
                        <span className="voter-chip voter-chip--booth">{item.BoothNo}</span>
                      )}
                    </div>

                    <dl className="voter-card__meta">
                      <div className="voter-card__meta-item">
                        <dt>EPIC No.</dt>
                        <dd>{item.EpicNo || '—'}</dd>
                      </div>
                      <div className="voter-card__meta-item">
                        <dt>District / Taluka</dt>
                        <dd>{[item.District, item.Taluka].filter(Boolean).join(' · ') || '—'}</dd>
                      </div>
                      {item.RelativeName && (
                        <div className="voter-card__meta-item">
                          <dt>Relative Name</dt>
                          <dd>{item.RelativeName}</dd>
                        </div>
                      )}
                      <div className="voter-card__meta-item voter-card__meta-item--wide">
                        <dt>Address</dt>
                        <dd>{item.Address || '—'}</dd>
                      </div>
                      {item.BoothName && (
                        <div className="voter-card__meta-item voter-card__meta-item--wide">
                          <dt>Polling Booth</dt>
                          <dd>
                            {item.BoothName}
                            {item.BoothNo ? ` (${item.BoothNo})` : ''}
                          </dd>
                        </div>
                      )}
                      <div className="voter-card__meta-item voter-card__meta-item--wide">
                        <dt>Mobile Number</dt>
                        <dd>
                          {item.MobileNumber ? (
                            <a href={`tel:${item.MobileNumber}`}>{item.MobileNumber}</a>
                          ) : (
                            '—'
                          )}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
              ))}
            </ul>

            {/* Proper Pagination */}
            {totalPages > 1 && (
              <div className="voter-pagination">
                <div className="voter-pagination__info">
                  Showing <strong>{((currentPage * 25) + 1).toLocaleString()}</strong> –{' '}
                  <strong>{Math.min((currentPage + 1) * 25, totalCount).toLocaleString()}</strong> of{' '}
                  <strong>{totalCount.toLocaleString()}</strong> voters · Page{' '}
                  <strong>{currentPage + 1}</strong> of <strong>{totalPages.toLocaleString()}</strong>
                </div>
                <div className="voter-pagination__controls">
                  <button
                    type="button"
                    className="voter-page-btn voter-page-btn--nav"
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0 || isSearching}
                    title="First Page"
                    aria-label="First Page"
                  >
                    <i className="fa fa-angles-left" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="voter-page-btn voter-page-btn--nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isSearching}
                    title="Previous Page"
                    aria-label="Previous Page"
                  >
                    <i className="fa fa-chevron-left" aria-hidden="true" /> Prev
                  </button>

                  <div className="voter-page-numbers">
                    {getPaginationItems().map((item, i) => {
                      if (typeof item === 'string') {
                        return (
                          <span key={`ellipsis-${i}`} className="voter-page-ellipsis">
                            …
                          </span>
                        );
                      }
                      const isActive = item === currentPage;
                      return (
                        <button
                          key={`page-${item}`}
                          type="button"
                          className={`voter-page-btn ${isActive ? 'is-active' : ''}`}
                          onClick={() => handlePageChange(item)}
                          disabled={isSearching}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="voter-page-btn voter-page-btn--nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || isSearching}
                    title="Next Page"
                    aria-label="Next Page"
                  >
                    Next <i className="fa fa-chevron-right" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="voter-page-btn voter-page-btn--nav"
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1 || isSearching}
                    title="Last Page"
                    aria-label="Last Page"
                  >
                    <i className="fa fa-angles-right" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Official Campaign Poster Modal */}
      {isPosterModalOpen && (
        <div
          className="poster-modal-overlay"
          onClick={() => setIsPosterModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="poster-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="poster-modal-header">
              <div className="poster-modal-title">
                <i className="fa fa-bullhorn" aria-hidden="true" />
                <span>अधिकृत निवडणूक प्रचार पत्रक · Campaign Poster</span>
              </div>
              <button
                type="button"
                className="poster-modal-close"
                onClick={() => setIsPosterModalOpen(false)}
                aria-label="Close modal"
              >
                <i className="fa fa-times" aria-hidden="true" />
              </button>
            </div>
            <div className="poster-modal-body">
              <img
                src="/img/shrikant_deshpande.jpg"
                alt="Dr. Shrikant Govind Deshpande - Election Campaign Poster"
                className="poster-modal-image"
              />
            </div>
            <div className="poster-modal-footer">
              <span className="poster-modal-hint">
                मतदान हे कन्यादान पेक्षाही श्रेष्ठ दान · अनुक्रमांक २१
              </span>
              <a
                href="/img/shrikant_deshpande.jpg"
                download="Dr_Shrikant_Deshpande_Campaign_Poster.jpg"
                className="voter-portal__tool"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-download" aria-hidden="true" />
                <span>Download Poster</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchVoters;
