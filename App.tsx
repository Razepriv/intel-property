import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PropertyDetails, StoredProperty, HistoryEntry } from './types';
import { extractPropertyDetails } from './services/geminiService';
import PropertyInfoCard from './components/PropertyInfoCard';
import LoadingIcon from './components/LoadingIcon';
import AppHeader from './components/AppHeader'; // New Import
import * as XLSX from 'xlsx';

const LOCAL_STORAGE_KEY_SAVED = 'storedPropertyIntel';
const LOCAL_STORAGE_KEY_HISTORY = 'propertyExtractionHistory';
const HISTORY_RETENTION_DAYS = 14;


// Helper function to flatten PropertyDetails for CSV/XLSX export
const flattenPropertyDetailsForExport = (details: PropertyDetails): Record<string, any> => {
  const flatData: Record<string, any> = {};

  flatData['Property Title'] = details.propertyTitle;
  flatData['Address'] = details.address;
  flatData['Price'] = details.price;
  flatData['Bedrooms'] = details.bedrooms;
  flatData['Bathrooms'] = details.bathrooms;
  flatData['SqFt'] = details.sqft;
  flatData['Property Type'] = details.propertyType;
  flatData['Purpose'] = details.purpose;
  flatData['Furnishing Type'] = details.furnishingType;
  flatData['Description'] = details.description;
  
  flatData['Key Features'] = details.keyFeatures?.join('; ') || '';
  flatData['Images'] = details.images?.join('; ') || '';
  flatData['Amenities'] = details.amenities?.join('; ') || '';
  flatData['Validated Information'] = details.validatedInformation?.join('; ') || '';
  
  flatData['Building Information'] = details.buildingInformation;
  flatData['Permit Number'] = details.permitNumber;
  flatData['DED Number'] = details.dedNumber;
  flatData['RERA Number'] = details.reraNumber;
  flatData['Reference ID'] = details.referenceId;
  flatData['BRN/DLD'] = details.brnDld;

  if (details.listedBy) {
    flatData['Listed By Name'] = details.listedBy.name;
    flatData['Listed By Phone'] = details.listedBy.phone;
    flatData['Listed By Email'] = details.listedBy.email;
    flatData['Listed By Company'] = details.listedBy.company;
  } else {
    flatData['Listed By Name'] = null;
    flatData['Listed By Phone'] = null;
    flatData['Listed By Email'] = null;
    flatData['Listed By Company'] = null;
  }
  return flatData;
};

const escapeCsvValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const convertToCsv = (flatData: Record<string, any>): string => {
  const headers = Object.keys(flatData);
  const row = headers.map(header => escapeCsvValue(flatData[header]));
  return `${headers.join(',')}\n${row.join(',')}`;
};


const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [scrapedText, setScrapedText] = useState<string>('');
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [storedProperties, setStoredProperties] = useState<StoredProperty[]>([]);
  const [extractionHistory, setExtractionHistory] = useState<HistoryEntry[]>([]);

  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState<boolean>(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const rawStoredProperties = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED);
      if (rawStoredProperties) {
        setStoredProperties(JSON.parse(rawStoredProperties));
      }
      const rawHistory = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      if (rawHistory) {
        const parsedHistory: HistoryEntry[] = JSON.parse(rawHistory);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - HISTORY_RETENTION_DAYS);
        const filteredHistory = parsedHistory.filter(entry => new Date(entry.extractedAt) >= twoWeeksAgo);
        setExtractionHistory(filteredHistory);
        if (filteredHistory.length !== parsedHistory.length) {
          // Pruned some items, so update localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(filteredHistory));
        }
      }
    } catch (e) {
      console.error("Failed to load data from localStorage:", e);
    }
  }, []);

  // Update localStorage for StoredProperties
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SAVED, JSON.stringify(storedProperties));
    } catch (e) {
      console.error("Failed to save properties to localStorage:", e);
      setError("Could not save properties to local storage. It might be full or disabled.");
    }
  }, [storedProperties]);

  // Update localStorage for ExtractionHistory
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(extractionHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
      // Non-critical error, so don't set global error state for this.
    }
  }, [extractionHistory]);


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    };
    if (isDownloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadDropdownOpen]);

  const sampleText = `
  Property Title: Luxury Marina View Apartment with Full Sea View
  For Sale: AED 3,500,000
  Address: Unit 1205, Marina Tower, Dubai Marina, Dubai, UAE
  Type: Apartment, Furnishing: Fully Furnished
  Specs: 3 Bedrooms, 4 Bathrooms, 2100 sqft.

  Description:
  Stunning 3-bedroom apartment in the heart of Dubai Marina offering breathtaking full sea views and direct marina access. 
  This meticulously designed unit boasts high-end finishes, a spacious open-plan living area, and floor-to-ceiling windows. 
  The modern kitchen comes fully equipped with Miele appliances. Each bedroom is en-suite, with the master featuring a walk-in closet and a luxurious bathroom with a jacuzzi tub. 
  Residents enjoy access to state-of-the-art facilities.
  Image URLs: https://example.com/image1.jpg, https://example.com/image2.png, http://example.com/image3.webp

  Key Features:
  - Panoramic Sea Views
  - Upgraded Interiors
  - Private Balcony
  - Smart Home System

  Amenities:
  - Infinity Pool
  - Modern Gymnasium
  - Children's Play Area
  - 24/7 Security & Concierge
  - Covered Parking (2 spots)
  - Sauna and Steam Room
  - BBQ Area

  Building Information: Marina Tower, Developed by Emaar, Completed 2022. Floor: 12/45.
  Validated Information: RERA Certified Property, Title Deed Ready.
  Permit Number: DXB-PERMIT-12345
  DED License: 987654
  RERA Registration: 54321
  Property Reference ID: APART-MARINA-001
  BRN (DLD): 12345 / DLD Permit: 67890

  Listed By:
  Agent: John Doe
  Company: Premium Properties LLC
  Phone: +971 50 123 4567
  Email: john.doe@premiumproperties.ae
  `;

  const handleExtractDetails = useCallback(async () => {
    setError(null);
    setPropertyDetails(null);
    setIsLoading(true);

    let contentToProcess = scrapedText.trim();
    let sourceType: 'url' | 'text' = 'text';
    let sourceIdentifier = contentToProcess.substring(0, 50) + (contentToProcess.length > 50 ? '...' : '');
    let isUrlFetch = false;

    if (urlInput.trim()) {
      isUrlFetch = true;
      sourceType = 'url';
      sourceIdentifier = urlInput.trim();
      setLoadingMessage("Fetching content from URL...");
      try {
        new URL(urlInput.trim()); 
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlInput.trim())}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch from URL: ${response.status} ${response.statusText}. The proxy or target site may be unavailable or blocking the request.`);
        }
        contentToProcess = await response.text();
        if (!contentToProcess.trim()) {
            throw new Error("Fetched content from URL is empty.");
        }
        setScrapedText(contentToProcess); 
      } catch (err) {
        let errorMessage = "An unknown error occurred while fetching from URL.";
        if (err instanceof Error) {
          errorMessage = err.message;
          if (err.message.includes('Failed to construct \'URL\'')) {
            errorMessage = "Invalid URL format. Please enter a valid web address (e.g., https://example.com).";
          }
        }
        setError(errorMessage);
        setIsLoading(false);
        return;
      }
    }
    
    if (!contentToProcess && !isUrlFetch) {
      setError("Please enter a URL or paste some property text to analyze.");
      setIsLoading(false);
      return;
    }
    
    if (!contentToProcess && isUrlFetch) {
        setError("No content to process. URL fetch might have resulted in empty data.");
        setIsLoading(false);
        return;
    }

    setLoadingMessage("Extracting property insights with AI...");
    try {
      const details = await extractPropertyDetails(contentToProcess);
      setPropertyDetails(details);

      // Add to history
      const newHistoryEntry: HistoryEntry = {
        id: Date.now().toString(),
        extractedAt: new Date().toISOString(),
        details: details,
        sourceType: sourceType,
        sourceIdentifier: sourceIdentifier
      };
      setExtractionHistory(prevHistory => {
        const updatedHistory = [newHistoryEntry, ...prevHistory];
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - HISTORY_RETENTION_DAYS);
        return updatedHistory.filter(entry => new Date(entry.extractedAt) >= twoWeeksAgo);
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during AI extraction.");
      }
      setPropertyDetails(null);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [urlInput, scrapedText]);

  const handleClear = () => {
    setUrlInput('');
    setScrapedText('');
    setPropertyDetails(null);
    setError(null);
    setIsLoading(false);
    setLoadingMessage('');
    setIsDownloadDropdownOpen(false);
  };
  
  const handleLoadSample = () => {
    setUrlInput(''); 
    setScrapedText(sampleText.trim());
    setPropertyDetails(null);
    setError(null);
    setIsDownloadDropdownOpen(false);
  }

  const handleSaveProperty = useCallback(() => {
    if (!propertyDetails) return;
    const newStoredProperty: StoredProperty = {
      id: `${Date.now()}-${propertyDetails.propertyTitle || 'untitled'}`,
      name: propertyDetails.propertyTitle || "Untitled Property",
      storedAt: new Date().toISOString(),
      details: propertyDetails,
    };
    setStoredProperties(prev => [newStoredProperty, ...prev.filter(p => p.id !== newStoredProperty.id)]); // Avoid duplicates if saving same item
    setIsDownloadDropdownOpen(false);
  }, [propertyDetails]);

  const getSafeFilename = (baseName?: string | null) => {
    return (baseName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'property_details');
  };

  const handleDownloadJson = useCallback(() => {
    if (!propertyDetails) return;
    const jsonString = JSON.stringify(propertyDetails, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getSafeFilename(propertyDetails.propertyTitle)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloadDropdownOpen(false);
  }, [propertyDetails]);

  const handleDownloadCsv = useCallback(() => {
    if (!propertyDetails) return;
    const flatData = flattenPropertyDetailsForExport(propertyDetails);
    const csvString = convertToCsv(flatData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getSafeFilename(propertyDetails.propertyTitle)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloadDropdownOpen(false);
  }, [propertyDetails]);

  const handleDownloadXlsx = useCallback(() => {
    if (!propertyDetails) return;
    const flatData = flattenPropertyDetailsForExport(propertyDetails);
    const worksheet = XLSX.utils.json_to_sheet([flatData]); // XLSX expects an array of objects
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PropertyDetails");
    XLSX.writeFile(workbook, `${getSafeFilename(propertyDetails.propertyTitle)}.xlsx`);
    setIsDownloadDropdownOpen(false);
  }, [propertyDetails]);


  const handleViewDetails = useCallback((details: PropertyDetails) => {
    setPropertyDetails(details);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteStoredProperty = useCallback((idToDelete: string) => {
    setStoredProperties(prev => prev.filter(p => p.id !== idToDelete));
  }, []);

  const canSubmit = (urlInput.trim() || scrapedText.trim()) && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 selection:bg-sky-500 selection:text-white">
      <AppHeader
        history={extractionHistory}
        savedProperties={storedProperties}
        onViewDetails={handleViewDetails}
        onDeleteSavedProperty={handleDeleteStoredProperty}
      />
      <main className="container mx-auto max-w-6xl py-8 px-4 pt-28"> {/* Added pt-28 for AppHeader spacing */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-3">
            Property Intel Extractor
          </h1>
          <p className="text-slate-400 text-lg">
            Enter a property listing URL or paste its text below. Save and manage your extracted insights.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Panel */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
            
            <label htmlFor="urlInput" className="block text-xl font-semibold text-sky-400 mb-2">
              Enter Property Listing URL
            </label>
            <input
              type="url"
              id="urlInput"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g., https://www.propertywebsite.com/listing/123"
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-200 placeholder-slate-500 mb-4"
              disabled={isLoading}
              aria-label="Property Listing URL"
            />

            <label htmlFor="scrapedText" className="block text-xl font-semibold text-sky-400 mb-2">
              Or Paste Property Text Here
            </label>
            <textarea
              id="scrapedText"
              value={scrapedText}
              onChange={(e) => setScrapedText(e.target.value)}
              placeholder="e.g., 'Luxury 3-bedroom villa for sale... (if not using URL)'"
              rows={15}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-200 resize-y placeholder-slate-500"
              disabled={isLoading}
              aria-label="Paste property text here"
            />
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExtractDetails}
                disabled={!canSubmit}
                className="w-full sm:w-auto flex-grow bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-busy={isLoading}
              >
                {isLoading ? <LoadingIcon className="w-5 h-5 mr-2" /> : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L24 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L17.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L24 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
                  </svg>
                )}
                {isLoading ? (loadingMessage.startsWith('Fetching') ? 'Fetching URL...' : 'Extracting...') : 'Extract Details'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
               <button
                onClick={handleLoadSample}
                disabled={isLoading}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-slate-100 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Sample Text
              </button>
            </div>
             <p className="text-xs text-slate-500 mt-4">
                Note: URL fetching uses a public CORS proxy (allorigins.win) for demonstration and may be unreliable. For robust scraping, a backend service is typically required.
            </p>
          </div>

          {/* Output Panel */}
          <div className="md:sticky md:top-28 space-y-6"> {/* Adjusted md:top-28 for AppHeader */}
            {isLoading && !propertyDetails && (
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-800 p-6 rounded-xl shadow-2xl" role="status" aria-live="polite">
                <LoadingIcon className="w-12 h-12 mb-4 text-sky-400" />
                <p className="text-xl text-slate-300">{loadingMessage || 'Processing...'}</p>
                <p className="text-sm text-slate-400">This might take a moment.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-800 border border-red-700 text-red-100 p-6 rounded-xl shadow-2xl" role="alert">
                <div className="flex">
                  <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-red-300 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.829 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.829 2.829a1 1 0 0 0 1.414-1.414L11.414 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-red-200">Error</p>
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {!isLoading && propertyDetails && (
              <>
                <PropertyInfoCard details={propertyDetails} />
                <div className="bg-slate-800 p-4 rounded-xl shadow-xl mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleSaveProperty}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3H5.25Z" /></svg>
                    Save Property
                  </button>
                  <div className="relative w-full sm:w-auto" ref={downloadDropdownRef}>
                    <button
                      onClick={() => setIsDownloadDropdownOpen(prev => !prev)}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center"
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>
                      Download Data
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1 opacity-75">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isDownloadDropdownOpen && (
                      <div className="absolute z-10 mt-2 w-full sm:w-48 origin-top-right bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <button
                            onClick={handleDownloadJson}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 hover:text-sky-300"
                            role="menuitem"
                          >
                            Download as JSON
                          </button>
                          <button
                            onClick={handleDownloadCsv}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 hover:text-sky-300"
                            role="menuitem"
                          >
                            Download as CSV
                          </button>
                          <button
                            onClick={handleDownloadXlsx}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 hover:text-sky-300"
                            role="menuitem"
                          >
                            Download as XLSX
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {!isLoading && !propertyDetails && !error && (
                <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-800 p-6 rounded-xl shadow-2xl text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-500 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <h3 className="text-2xl font-semibold text-slate-400 mb-2">Awaiting Property Data</h3>
                    <p className="text-slate-500">Enter a URL or paste property text and click "Extract Details".</p>
                </div>
            )}
          </div>
        </div>
        
        <footer className="text-center mt-16 py-6 border-t border-slate-700">
          <p className="text-slate-500 text-sm">
            Property Intel Extractor &copy; {new Date().getFullYear()}.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;