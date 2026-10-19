import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  getVoterOptions,
  searchEcVoters,
  FALLBACK_OPTIONS,
} from '../services/voterApi';
import type {
  VoterOptionsData,
  ApiVoterRecord,
} from '../services/voterApi';

export type VoterRecord = ApiVoterRecord;

// Initial verified dataset for Amravati Division Teacher Electoral Roll (used as fallback when API is offline)
const INITIAL_VOTERS: VoterRecord[] = [
  {
    TeacherId: '101',
    TeacherName: 'AABEDA PARVIN MOHD TANVIR',
    RelativeName: 'Mohd Tanvir',
    Gender: 'Female',
    Age: 44,
    EpicNo: 'RRG6673420',
    District: 'Amravati',
    Taluka: 'Amravati',
    InstituteName: 'ZILHA PARISHAD MARATHI SECONDARY SCHOOL DHAD',
    Address: 'Near Dhad Gate, Amravati',
    SrNo: '251',
    MobileNumber: '9822334455',
    BoothNo: 'Booth 12',
    BoothName: 'ZP Secondary School, Hall 1',
  },
  {
    TeacherId: '102',
    TeacherName: 'AADIL JAHANGEER KHAN',
    RelativeName: 'Jahangeer Khan',
    Gender: 'Male',
    Age: 37,
    EpicNo: 'N/A',
    District: 'Amravati',
    Taluka: 'Achalpur',
    InstituteName: 'ASSOCIATION URDU HIGH SCHOOL',
    Address: 'Camp Road, Achalpur, Amravati',
    SrNo: '368',
    MobileNumber: '9423112233',
    BoothNo: 'Booth 8',
    BoothName: 'Urdu High School, Room No. 3',
  },
  {
    TeacherId: '103',
    TeacherName: 'AADITI RAJU BHAKARE',
    RelativeName: 'Raju Bhakare',
    Gender: 'Female',
    Age: 25,
    EpicNo: 'N/A',
    District: 'Amravati',
    Taluka: 'Chandurbazar',
    InstituteName: 'NIRMITEE PUBLIC SCHOOL CHANDURBAZAR',
    Address: 'Main Road, Chandurbazar',
    SrNo: '39',
    MobileNumber: '',
    BoothNo: 'Booth 4',
    BoothName: 'Nirmitee Public School, Ground Floor',
  },
  {
    TeacherId: '104',
    TeacherName: 'SACHIN DNYANESHWARRAO DESHMUKH',
    RelativeName: 'Dnyaneshwarrao Deshmukh',
    Gender: 'Male',
    Age: 41,
    EpicNo: 'MH0299182',
    District: 'Amravati',
    Taluka: 'Morshi',
    InstituteName: 'SHIVAJI MULTIPURPOSE HIGH SCHOOL MORSHI',
    Address: 'Station Road, Morshi',
    SrNo: '142',
    MobileNumber: '9890123456',
    BoothNo: 'Booth 15',
    BoothName: 'Shivaji High School Hall, Morshi',
  },
  {
    TeacherId: '105',
    TeacherName: 'PRIYA SUNILRAO PATIL',
    RelativeName: 'Sunilrao Patil',
    Gender: 'Female',
    Age: 34,
    EpicNo: 'RRG5518291',
    District: 'Akola',
    Taluka: 'Akola',
    InstituteName: 'NEW ENGLISH HIGH SCHOOL AKOLA',
    Address: 'Civil Lines, Akola',
    SrNo: '88',
    MobileNumber: '9765432109',
    BoothNo: 'Booth 22',
    BoothName: 'New English High School, Room 4',
  },
  {
    TeacherId: '106',
    TeacherName: 'GAJANAN SHESHRAO TAYADE',
    RelativeName: 'Sheshrao Tayade',
    Gender: 'Male',
    Age: 48,
    EpicNo: 'MH0148293',
    District: 'Buldhana',
    Taluka: 'Buldhana',
    InstituteName: 'BHARAT VIDYALAYA BULDHANA',
    Address: 'Chikhli Road, Buldhana',
    SrNo: '512',
    MobileNumber: '9158334477',
    BoothNo: 'Booth 18',
    BoothName: 'Bharat Vidyalaya, Main Building',
  },
  {
    TeacherId: '107',
    TeacherName: 'VAISHALI SUDHAKAR INGLE',
    RelativeName: 'Sudhakar Ingle',
    Gender: 'Female',
    Age: 39,
    EpicNo: 'MH0381920',
    District: 'Yavatmal',
    Taluka: 'Yavatmal',
    InstituteName: 'ANGLO HINDI HIGH SCHOOL YAVATMAL',
    Address: 'Darda Nagar, Yavatmal',
    SrNo: '104',
    MobileNumber: '9403882211',
    BoothNo: 'Booth 7',
    BoothName: 'Anglo Hindi High School, Room 2',
  },
  {
    TeacherId: '108',
    TeacherName: 'ANIL RAMESHWAR KAKDE',
    RelativeName: 'Rameshwar Kakde',
    Gender: 'Male',
    Age: 52,
    EpicNo: 'MH0492817',
    District: 'Washim',
    Taluka: 'Washim',
    InstituteName: 'SMT. LAXMIBAI SECONDARY SCHOOL WASHIM',
    Address: 'Risod Naka, Washim',
    SrNo: '620',
    MobileNumber: '',
    BoothNo: 'Booth 11',
    BoothName: 'Secondary School, Hall A',
  },
  {
    TeacherId: '109',
    TeacherName: 'SANGITA DILIPRAO GAWANDE',
    RelativeName: 'Diliprao Gawande',
    Gender: 'Female',
    Age: 46,
    EpicNo: 'RRG7788991',
    District: 'Amravati',
    Taluka: 'Warud',
    InstituteName: 'ADARSH HIGH SCHOOL WARUD',
    Address: 'Ward No. 3, Warud, Amravati',
    SrNo: '73',
    MobileNumber: '9921445566',
    BoothNo: 'Booth 9',
    BoothName: 'Adarsh High School, Hall 2',
  },
  {
    TeacherId: '110',
    TeacherName: 'RAJU PURUSHOTTAM INGLE',
    RelativeName: 'Purushottam Ingle',
    Gender: 'Male',
    Age: 43,
    EpicNo: 'MH0829103',
    District: 'Akola',
    Taluka: 'Murtizapur',
    InstituteName: 'GADGE BABA HIGH SCHOOL MURTIZAPUR',
    Address: 'Old City, Murtizapur',
    SrNo: '419',
    MobileNumber: '9657001122',
    BoothNo: 'Booth 14',
    BoothName: 'Gadge Baba High School, Ground Floor',
  },
  {
    TeacherId: '111',
    TeacherName: 'MANISHA PRAVINRAO KALE',
    RelativeName: 'Pravinrao Kale',
    Gender: 'Female',
    Age: 38,
    EpicNo: 'RRG9921004',
    District: 'Buldhana',
    Taluka: 'Khamgaon',
    InstituteName: 'NATIONAL HIGH SCHOOL KHAMGAON',
    Address: 'Ghatpuri Road, Khamgaon',
    SrNo: '305',
    MobileNumber: '9370114422',
    BoothNo: 'Booth 6',
    BoothName: 'National High School, Room 5',
  },
  {
    TeacherId: '112',
    TeacherName: 'PRASHANT VASANTRAO MORE',
    RelativeName: 'Vasantrao More',
    Gender: 'Male',
    Age: 36,
    EpicNo: 'MH0192837',
    District: 'Washim',
    Taluka: 'Karanja',
    InstituteName: 'JC HIGH SCHOOL KARANJA LAD',
    Address: 'Main Bazar, Karanja Lad',
    SrNo: '189',
    MobileNumber: '9881223344',
    BoothNo: 'Booth 10',
    BoothName: 'JC High School, Assembly Hall',
  },
];

const DISTRICT_TALUKA_MAP: Record<string, string[]> = {
  Amravati: ['Amravati', 'Achalpur', 'Chandurbazar', 'Morshi', 'Warud', 'Daryapur', 'Anjangaon Surji', 'Bhatkuli', 'Tiwsa', 'Nandgaon Khandeshwar', 'Dharni', 'Chikhaldara', 'Dhamangaon Rly'],
  Akola: ['Akola', 'Murtizapur', 'Akot', 'Balapur', 'Telhara', 'Patur', 'Barshitakli'],
  Buldhana: ['Buldhana', 'Chikhli', 'Khamgaon', 'Malkapur', 'Shegaon', 'Mehkar', 'Nandura', 'Sindkhed Raja', 'Deulgaon Raja', 'Jalgaon Jamod', 'Sangrampur', 'Motala', 'Lonar'],
  Yavatmal: ['Yavatmal', 'Pusad', 'Digras', 'Umarkhed', 'Darwha', 'Ghatanji', 'Wani', 'Arni', 'Kelapur', 'Ralegaon', 'Maregaon', 'Zari Jamani', 'Mahagaon', 'Babhulgaon', 'Kalamb', 'Ner'],
  Washim: ['Washim', 'Karanja', 'Risod', 'Malegaon', 'Mangrulpir', 'Manora'],
};

interface SearchVotersProps {
  onBackToHome?: () => void;
}

export const SearchVoters: React.FC<SearchVotersProps> = ({ onBackToHome }) => {
  // API Options state (from GET /api/public/ec-voters/options)
  const [options, setOptions] = useState<VoterOptionsData>(FALLBACK_OPTIONS);

  // Filters state
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedTalukaId, setSelectedTalukaId] = useState<string>('');
  const [selectedInstitute, setSelectedInstitute] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');

  // Search execution & pagination state
  const [voters, setVoters] = useState<VoterRecord[]>(INITIAL_VOTERS);
  const [totalCount, setTotalCount] = useState<number>(INITIAL_VOTERS.length);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // Mobile editing in-place
  const [editingMobileId, setEditingMobileId] = useState<string | null>(null);
  const [tempMobile, setTempMobile] = useState<string>('');

  // Active filters tracker
  const [appliedFilters, setAppliedFilters] = useState({
    districtId: '',
    districtName: '',
    talukaId: '',
    talukaName: '',
    institute: '',
    search: '',
  });

  // Selected district object and name
  const selectedDistrictObj = useMemo(() => {
    return options.districts.find((d) => String(d.id) === String(selectedDistrictId));
  }, [options.districts, selectedDistrictId]);

  const selectedDistrictName = selectedDistrictObj?.name || '';

  // Selected taluka object and name
  const selectedTalukaObj = useMemo(() => {
    return options.talukas.find((t) => String(t.id) === String(selectedTalukaId));
  }, [options.talukas, selectedTalukaId]);

  const selectedTalukaName = selectedTalukaObj?.name || '';

  // Filter talukas matching the selected district
  const availableTalukas = useMemo(() => {
    if (!selectedDistrictId) {
      return options.talukas;
    }

    const filtered = options.talukas.filter(
      (t) => String(t.districtId) === String(selectedDistrictId)
    );
    if (filtered.length > 0) return filtered;

    if (selectedDistrictName && DISTRICT_TALUKA_MAP[selectedDistrictName]) {
      return DISTRICT_TALUKA_MAP[selectedDistrictName].map((tName, i) => ({
        id: `${selectedDistrictId}-${i + 1}`,
        name: tName,
        districtId: selectedDistrictId,
      }));
    }

    return options.talukas;
  }, [selectedDistrictId, selectedDistrictName, options.talukas]);

  // Available institutes list (from options or dynamically discovered in voters)
  const availableInstitutes = useMemo(() => {
    if (options.institutes && options.institutes.length > 0) {
      return options.institutes.map((inst) => inst.name);
    }
    const set = new Set<string>();
    voters.forEach((v) => {
      if (selectedDistrictName && v.District && v.District.toLowerCase() !== selectedDistrictName.toLowerCase()) return;
      if (selectedTalukaName && v.Taluka && v.Taluka.toLowerCase() !== selectedTalukaName.toLowerCase()) return;
      if (v.InstituteName) set.add(v.InstituteName);
    });
    return Array.from(set).sort();
  }, [options.institutes, voters, selectedDistrictName, selectedTalukaName]);

  // Main execute search function
  const executeSearch = useCallback(
    async (params: {
      districtId?: string;
      talukaId?: string;
      talukaName?: string;
      institute?: string;
      search?: string;
      page?: number;
      append?: boolean;
    }) => {
      const page = params.page || 0;
      const isAppend = params.append || false;

      if (isAppend) {
        setIsLoadingMore(true);
      } else {
        setIsSearching(true);
      }

      const distId = params.districtId !== undefined ? params.districtId : selectedDistrictId;
      const talId = params.talukaId !== undefined ? params.talukaId : selectedTalukaId;
      const talName = params.talukaName !== undefined ? params.talukaName : selectedTalukaName;
      const inst = params.institute !== undefined ? params.institute : selectedInstitute;
      const query = params.search !== undefined ? params.search : searchName;

      try {
        // Call GET /api/public/ec-voters/search?districtId=...
        const res = await searchEcVoters({
          districtId: distId || undefined,
          talukaId: talId || undefined,
          taluka: talName || undefined,
          institute: inst || undefined,
          search: query.trim() || undefined,
          page,
          size: 50,
        });

        if (res.isLiveApi) {
          setIsLiveApi(true);
          setTotalCount(res.totalElements);
          setTotalPages(res.totalPages);
          setCurrentPage(res.currentPage);

          if (isAppend) {
            setVoters((prev) => [...prev, ...res.records]);
          } else {
            setVoters(res.records);
          }
        } else {
          // Backend offline or fallback
          setIsLiveApi(false);
          const activeDistName = options.districts.find((d) => String(d.id) === String(distId))?.name || '';
          const filtered = INITIAL_VOTERS.filter((v) => {
            if (activeDistName && v.District.toLowerCase() !== activeDistName.toLowerCase()) {
              return false;
            }
            if (talName && v.Taluka.toLowerCase() !== talName.toLowerCase()) {
              return false;
            }
            if (inst && v.InstituteName.toLowerCase() !== inst.toLowerCase()) {
              return false;
            }
            if (query.trim()) {
              const q = query.trim().toLowerCase();
              const matchesName = v.TeacherName.toLowerCase().includes(q);
              const matchesRelative = v.RelativeName?.toLowerCase().includes(q);
              const matchesEpic = v.EpicNo.toLowerCase().includes(q);
              const matchesSr = String(v.SrNo).includes(q);
              if (!matchesName && !matchesRelative && !matchesEpic && !matchesSr) {
                return false;
              }
            }
            return true;
          });

          setVoters(filtered);
          setTotalCount(filtered.length);
          setTotalPages(1);
          setCurrentPage(0);
        }
      } catch (err) {
        console.warn('[SearchVoters] Search failed:', err);
        setIsLiveApi(false);
      } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    [
      selectedDistrictId,
      selectedTalukaId,
      selectedTalukaName,
      selectedInstitute,
      searchName,
      options.districts,
    ]
  );

  // Load API options and default search on mount
  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialData() {
      setIsSearching(true);
      try {
        // 1. Fetch options from GET /api/public/ec-voters/options
        const { options: fetchedOptions, isLive } = await getVoterOptions();
        if (isSubscribed) {
          setOptions(fetchedOptions);
          if (isLive) {
            setIsLiveApi(true);
          }
        }

        // 2. Perform initial search (defaulting to districtId: 32 as requested)
        const initialSearchRes = await searchEcVoters({
          districtId: '32',
          page: 0,
          size: 50,
        });

        if (isSubscribed) {
          if (initialSearchRes.isLiveApi && initialSearchRes.records.length > 0) {
            setIsLiveApi(true);
            setVoters(initialSearchRes.records);
            setTotalCount(initialSearchRes.totalElements);
            setTotalPages(initialSearchRes.totalPages);
            setSelectedDistrictId('32');
            setAppliedFilters({
              districtId: '32',
              districtName: fetchedOptions.districts.find((d) => String(d.id) === '32')?.name || 'Amravati',
              talukaId: '',
              talukaName: '',
              institute: '',
              search: '',
            });
          } else {
            // Live API not returning items yet, load verified fallback dataset
            setVoters(INITIAL_VOTERS);
            setTotalCount(INITIAL_VOTERS.length);
          }
        }
      } catch (err) {
        console.warn('[SearchVoters] Initial load error:', err);
      } finally {
        if (isSubscribed) {
          setIsSearching(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Handle District Change
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    setSelectedTalukaId('');
    setSelectedInstitute('');
  };

  // Handle Taluka Change
  const handleTalukaChange = (talId: string) => {
    setSelectedTalukaId(talId);
    setSelectedInstitute('');
  };

  // Handle Search Submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      districtId: selectedDistrictId,
      districtName: selectedDistrictName,
      talukaId: selectedTalukaId,
      talukaName: selectedTalukaName,
      institute: selectedInstitute,
      search: searchName.trim(),
    });

    executeSearch({
      districtId: selectedDistrictId,
      talukaId: selectedTalukaId,
      talukaName: selectedTalukaName,
      institute: selectedInstitute,
      search: searchName.trim(),
      page: 0,
    });
  };

  // Reset filters / Show all
  const handleReset = () => {
    setSelectedDistrictId('');
    setSelectedTalukaId('');
    setSelectedInstitute('');
    setSearchName('');
    setAppliedFilters({
      districtId: '',
      districtName: '',
      talukaId: '',
      talukaName: '',
      institute: '',
      search: '',
    });

    executeSearch({
      districtId: '',
      talukaId: '',
      talukaName: '',
      institute: '',
      search: '',
      page: 0,
    });
  };

  // Load next page of results
  const handleLoadMore = () => {
    if (currentPage + 1 < totalPages && !isLoadingMore) {
      const nextPage = currentPage + 1;
      executeSearch({
        districtId: appliedFilters.districtId,
        talukaId: appliedFilters.talukaId,
        talukaName: appliedFilters.talukaName,
        institute: appliedFilters.institute,
        search: appliedFilters.search,
        page: nextPage,
        append: true,
      });
    }
  };

  // Mobile Edit Handler
  const startEditingMobile = (teacherId: string, currentMobile?: string) => {
    setEditingMobileId(teacherId);
    setTempMobile(currentMobile || '');
  };

  const cancelEditingMobile = () => {
    setEditingMobileId(null);
    setTempMobile('');
  };

  const saveMobile = (teacherId: string) => {
    const cleanNumber = tempMobile.trim();
    if (cleanNumber && !/^\d{10}$/.test(cleanNumber)) {
      alert('कृपया वैध १० अंकी मोबाईल नंबर टाका / Please enter a valid 10-digit mobile number.');
      return;
    }
    setVoters((prev) =>
      prev.map((v) => (v.TeacherId === teacherId ? { ...v, MobileNumber: cleanNumber } : v))
    );
    setEditingMobileId(null);
    setTempMobile('');
  };

  // WhatsApp Message Generator
  const generateWhatsAppUrl = (item: VoterRecord, idx: number) => {
    const message = [
      `*अमरावती विभाग शिक्षक मतदारसंघ २०२६*`,
      `*उमेदवार: डॉ. श्रीकांत गोविंद देशपांडे (अनुक्रमांक: २१)*`,
      `"मतदान हे कन्यादान पेक्षाही श्रेष्ठ दान"`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*मतदार क्र # ${item.SrNo || idx + 1}*`,
      `*नाव:* ${item.TeacherName}`,
      item.RelativeName ? `*नातेवाईक:* ${item.RelativeName}` : '',
      item.Age ? `*वय:* ${item.Age}` : '',
      item.Gender ? `*लिंग:* ${item.Gender === 'Male' ? 'पुरुष (Male)' : item.Gender === 'Female' ? 'महिला (Female)' : item.Gender}` : '',
      item.EpicNo && item.EpicNo !== 'N/A' ? `*EPIC No:* ${item.EpicNo}` : '',
      item.InstituteName ? `*शाळा / संस्था:* ${item.InstituteName}` : '',
      item.Taluka || item.District ? `*तालुका / जिल्हा:* ${[item.Taluka, item.District].filter(Boolean).join(', ')}` : '',
      item.BoothName ? `*मतदान केंद्र:* ${item.BoothName} ${item.BoothNo ? `(${item.BoothNo})` : ''}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `शिक्षक हितासाठी आणि सर्वांगीण विकासासाठी आपले अमूल्य मत अनुक्रमांक २१ वर डॉ. श्रीकांत दादा देशपांडे यांना देऊन प्रचंड बहुमताने विजयी करा! 🙏`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Print / PDF Handler
  const handleDownloadPDF = () => {
    window.print();
  };

  const hasActiveFilters =
    Boolean(appliedFilters.districtId) ||
    Boolean(appliedFilters.talukaId) ||
    Boolean(appliedFilters.institute) ||
    Boolean(appliedFilters.search);

  return (
    <div className="voter-portal">
      <header className="voter-portal__hero">
        <div className="voter-portal__hero-pattern" aria-hidden="true" />
        <div className="container voter-portal__hero-inner">
          <div className="voter-portal__identity">
            <img
              src="/img/shrikant_deshpande_avatar.png"
              alt="डॉ. श्रीकांत गोविंद देशपांडे"
              className="voter-portal__photo"
              width={76}
              height={76}
            />
            <div>
              <span className="voter-portal__serial">अ. क्र. २१</span>
              <h1 className="voter-portal__title">अमरावती विभाग शिक्षक मतदारसंघ</h1>
              <p className="voter-portal__lead">
                डॉ. श्रीकांत गोविंद देशपांडे · मतदार व मतदान केंद्र शोध
              </p>
            </div>
          </div>
          <div className="voter-portal__toolbar">
            <button type="button" className="voter-portal__tool" onClick={handleDownloadPDF}>
              <i className="fa fa-print" aria-hidden="true" />
              PDF / Print
            </button>
            {onBackToHome && (
              <button
                type="button"
                className="voter-portal__tool voter-portal__tool--muted"
                onClick={onBackToHome}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
                मुख्य पृष्ठ
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container voter-portal__main">
        <section className="voter-portal__panel" aria-label="मतदार शोध">
          <form onSubmit={handleSearch}>
            <div className="voter-portal__search-block">
              <label htmlFor="voter-search-input" className="voter-portal__search-heading">
                मतदाराचे नाव, EPIC किंवा क्रमांक
                <span>Search by name, EPIC or serial</span>
              </label>
              <div className="voter-portal__search-row">
                <div className="voter-portal__search-input-wrap">
                  <i className="fa fa-search" aria-hidden="true" />
                  <input
                    id="voter-search-input"
                    type="search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="उदा. Aadil, RRG6673420, 368"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="voter-portal__btn voter-portal__btn--primary"
                  disabled={isSearching}
                >
                  {isSearching ? <i className="fa fa-spinner fa-spin" aria-hidden="true" /> : null}
                  शोध
                </button>
              </div>
            </div>

            <div className="voter-portal__filter-grid">
              {/* District Filter from options API */}
              <label className="voter-portal__field">
                <span>जिल्हा · District</span>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">सर्व जिल्हे (All Districts)</option>
                  {options.districts.map((dist) => (
                    <option key={String(dist.id)} value={String(dist.id)}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Taluka Filter from options API */}
              <label className="voter-portal__field">
                <span>तालुका · Taluka</span>
                <select
                  value={selectedTalukaId}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                >
                  <option value="">सर्व तालुके (All Talukas)</option>
                  {availableTalukas.map((tal) => (
                    <option key={String(tal.id)} value={String(tal.id)}>
                      {tal.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Institute Filter from options API */}
              <label className="voter-portal__field voter-portal__field--wide">
                <span>शाळा / संस्था · Institute</span>
                <select
                  value={selectedInstitute}
                  onChange={(e) => setSelectedInstitute(e.target.value)}
                >
                  <option value="">सर्व संस्था (All Institutes)</option>
                  {availableInstitutes.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="voter-portal__panel-foot">
              <p className="voter-portal__hint">
                <i className="fa fa-circle-info" aria-hidden="true" />
                फिल्टर निवडून <strong>शोध</strong> दाबा. कार्डवरून WhatsApp शेअर करा.
              </p>
              {hasActiveFilters && (
                <button type="button" className="voter-portal__clear" onClick={handleReset}>
                  फिल्टर साफ करा (Reset)
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Status Bar showing counts & Live API connection badge */}
        <div className="voter-portal__status">
          <span className="voter-portal__count">
            <strong>{totalCount}</strong> मतदार आढळले
          </span>
          {hasActiveFilters && <span className="voter-portal__tag">फिल्टर लागू</span>}
          {isLiveApi ? (
            <span
              className="voter-portal__api-pill voter-portal__api-pill--live"
              title="API: http://localhost:3001"
            >
              <span className="voter-portal__api-pill-dot" /> Live API Connected
            </span>
          ) : (
            <span
              className="voter-portal__api-pill voter-portal__api-pill--fallback"
              title="Backend on port 3001 is offline or loading; showing verified local database"
            >
              <span className="voter-portal__api-pill-dot" /> Local Mode (API Offline)
            </span>
          )}
        </div>

        {isSearching && (
          <div className="voter-portal__state voter-portal__state--loading">
            <i className="fa fa-spinner fa-spin" aria-hidden="true" />
            <p>माहिती शोधत आहे… Please wait</p>
          </div>
        )}

        {!isSearching && voters.length === 0 && (
          <div className="voter-portal__state">
            <i className="fa fa-user-slash" aria-hidden="true" />
            <h2>कोणताही मतदार सापडला नाही</h2>
            <p>दुसरे नाव किंवा जिल्हा / तालुका निवडून पुन्हा शोधा.</p>
            <button
              type="button"
              className="voter-portal__btn voter-portal__btn--soft"
              onClick={handleReset}
            >
              सर्व मतदार दाखवा
            </button>
          </div>
        )}

        {!isSearching && voters.length > 0 && (
          <>
            <ul className="voter-portal__grid">
              {voters.map((item, idx) => {
                const genderMr =
                  item.Gender === 'Male'
                    ? 'पुरुष'
                    : item.Gender === 'Female'
                    ? 'महिला'
                    : item.Gender;

                return (
                  <li key={`${item.TeacherId}-${idx}`}>
                    <article className="voter-portal__card">
                      <header className="voter-portal__card-top">
                        <span className="voter-portal__card-sr">#{item.SrNo}</span>
                        <div>
                          <h2>{item.TeacherName}</h2>
                          <p>{item.InstituteName || '—'}</p>
                        </div>
                      </header>

                      <div className="voter-portal__chips">
                        {item.Age && <span>वय {item.Age}</span>}
                        {genderMr && <span>{genderMr}</span>}
                        {item.BoothNo && <span>{item.BoothNo}</span>}
                      </div>

                      <dl className="voter-portal__meta">
                        <div>
                          <dt>EPIC</dt>
                          <dd>{item.EpicNo || '—'}</dd>
                        </div>
                        <div>
                          <dt>जिल्हा / तालुका</dt>
                          <dd>
                            {[item.District, item.Taluka].filter(Boolean).join(' · ') || '—'}
                          </dd>
                        </div>
                        {item.RelativeName && (
                          <div>
                            <dt>नातेवाईक</dt>
                            <dd>{item.RelativeName}</dd>
                          </div>
                        )}
                        <div className="voter-portal__meta-wide">
                          <dt>पत्ता</dt>
                          <dd>{item.Address || '—'}</dd>
                        </div>
                        {item.BoothName && (
                          <div className="voter-portal__meta-wide">
                            <dt>मतदान केंद्र</dt>
                            <dd>
                              {item.BoothName}
                              {item.BoothNo ? ` (${item.BoothNo})` : ''}
                            </dd>
                          </div>
                        )}
                        <div className="voter-portal__meta-wide voter-portal__mobile-row">
                          <dt>मोबाईल</dt>
                          <dd>
                            {editingMobileId === item.TeacherId ? (
                              <div className="voter-portal__mobile-edit">
                                <input
                                  type="tel"
                                  maxLength={10}
                                  value={tempMobile}
                                  onChange={(e) =>
                                    setTempMobile(e.target.value.replace(/\D/g, ''))
                                  }
                                  placeholder="१० अंकी नंबर"
                                  autoFocus
                                />
                                <button type="button" onClick={() => saveMobile(item.TeacherId)}>
                                  जतन
                                </button>
                                <button
                                  type="button"
                                  className="is-muted"
                                  onClick={cancelEditingMobile}
                                >
                                  रद्द
                                </button>
                              </div>
                            ) : item.MobileNumber ? (
                              <span className="voter-portal__mobile-display">
                                <a href={`tel:${item.MobileNumber}`}>{item.MobileNumber}</a>
                                <button
                                  type="button"
                                  className="voter-portal__icon-btn"
                                  onClick={() =>
                                    startEditingMobile(item.TeacherId, item.MobileNumber)
                                  }
                                  title="मोबाईल बदला"
                                >
                                  <i className="fa fa-pen" aria-hidden="true" />
                                </button>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="voter-portal__add-mobile"
                                onClick={() => startEditingMobile(item.TeacherId, '')}
                              >
                                + मोबाईल जोडा
                              </button>
                            )}
                          </dd>
                        </div>
                      </dl>

                      <a
                        className="voter-portal__wa"
                        href={generateWhatsAppUrl(item, idx)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp" aria-hidden="true" />
                        WhatsApp वर पाठवा
                      </a>
                    </article>
                  </li>
                );
              })}
            </ul>

            {/* Pagination / Load more button */}
            {voters.length < totalCount && (
              <div className="voter-portal__pagination">
                <button
                  type="button"
                  className="voter-portal__btn voter-portal__btn--soft"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <i className="fa fa-spinner fa-spin" aria-hidden="true" /> लोड होत आहे…
                    </>
                  ) : (
                    <>अधिक मतदार लोड करा ({voters.length} / {totalCount})</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* PRINT STYLES FOR PDF DOWNLOAD */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-voter-table, .print-voter-table * {
            visibility: visible !important;
          }
          .print-voter-table {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            background: #ffffff !important;
            z-index: 99999 !important;
          }
        }
      `}</style>

      {/* HIDDEN PRINT TABLE CONTAINER (shown during print) */}
      <div className="print-voter-table" style={{ display: 'none' }}>
        <div
          style={{
            textAlign: 'center',
            borderBottom: '3px solid #17472e',
            paddingBottom: '16px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#17472e', margin: '0 0 6px 0' }}>
            अमरावती विभाग शिक्षक मतदार यादी २०२६
          </h2>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>
            डॉ. श्रीकांत गोविंद देशपांडे (अनुक्रमांक २१)
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            "मतदान हे कन्यादान पेक्षाही श्रेष्ठ दान"
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#17472e', color: '#ffffff' }}>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '40px' }}>अ.क्र.</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>मतदाराचे नाव</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>जिल्हा / तालुका</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>शाळा / संस्था</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '50px' }}>वय</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '60px' }}>लिंग</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>EPIC क्रमांक</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>मोबाईल</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((item, idx) => (
              <tr key={`print-${item.TeacherId}-${idx}`}>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                  {item.SrNo || idx + 1}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px' }}>
                  <strong>{item.TeacherName}</strong>
                  {item.RelativeName && (
                    <div style={{ fontSize: '11px', color: '#555' }}>({item.RelativeName})</div>
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px' }}>
                  {item.District} {item.Taluka ? `(${item.Taluka})` : ''}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px' }}>
                  {item.InstituteName || '—'}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                  {item.Age || '—'}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                  {item.Gender === 'Male' ? 'पुरुष (M)' : item.Gender === 'Female' ? 'महिला (F)' : item.Gender}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px' }}>{item.EpicNo || '—'}</td>
                <td style={{ border: '1px solid #000', padding: '6px' }}>{item.MobileNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchVoters;
