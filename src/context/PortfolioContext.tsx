import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getDraftData,
  getPublishedData,
  hasUnpublishedChanges,
  publishLive,
  resetPortfolioDefaults,
  saveDraftData,
  syncFromIndexedDB,
} from '../services/storageService';
import { syncToSupabase } from '../services/supabaseClient';
import { fetchRemotePortfolioData } from '../services/githubSync';
import type { PortfolioData } from '../types/portfolio';

interface PortfolioContextType {
  data: PortfolioData;
  draftData: PortfolioData;
  isDraftPreview: boolean;
  hasUnsaved: boolean;
  isAdminOpen: boolean;
  setDraftData: React.Dispatch<React.SetStateAction<PortfolioData>>;
  saveDraft: () => boolean;
  publish: () => Promise<boolean>;
  resetToDefaults: () => void;
  toggleDraftPreview: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  refreshData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [publishedData, setPublishedData] = useState<PortfolioData>(getPublishedData);
  const [draftData, setDraftData] = useState<PortfolioData>(getDraftData);
  const [isDraftPreview, setIsDraftPreview] = useState<boolean>(false);
  const [hasUnsaved, setHasUnsaved] = useState<boolean>(hasUnpublishedChanges);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin' || window.location.pathname === '/admin';
  });

  const refreshData = () => {
    const pub = getPublishedData();
    const draft = getDraftData();
    setPublishedData(pub);
    setDraftData(draft);
    setHasUnsaved(hasUnpublishedChanges());
  };

  // Restore redundant state from IndexedDB on initial mount
  useEffect(() => {
    syncFromIndexedDB().then((synced) => {
      if (synced) {
        setPublishedData(synced.published);
        setDraftData(synced.draft);
        setHasUnsaved(hasUnpublishedChanges());
      }
    });

    // Check for newly published data across devices from the repository
    fetchRemotePortfolioData().then((remoteData) => {
      if (remoteData && remoteData.profile) {
        setPublishedData((prev) => {
          if (!prev.lastUpdated || (remoteData.lastUpdated && remoteData.lastUpdated > prev.lastUpdated)) {
            return remoteData;
          }
          return prev;
        });
      }
    });
  }, []);

  // Real-time automatic persistence: debounced save so user edits are NEVER lost on page refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftData(draftData);
      setHasUnsaved(hasUnpublishedChanges());
    }, 450);
    return () => clearTimeout(timer);
  }, [draftData]);

  // Listen for admin shortcut keys: Ctrl + Shift + A or Ctrl + Alt + A or Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isA = (e.key && e.key.toLowerCase() === 'a') || e.code === 'KeyA';
      const hasModifier = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey);

      if (hasModifier && isA) {
        e.preventDefault();
        e.stopPropagation();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // Listen to hash changes for #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminOpen(true);
  };

  const closeAdmin = () => {
    if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setIsAdminOpen(false);
  };

  const saveDraft = (): boolean => {
    const success = saveDraftData(draftData);
    if (success) {
      setHasUnsaved(hasUnpublishedChanges());
    }
    return success;
  };

  const publish = async (): Promise<boolean> => {
    const success = await publishLive(draftData);
    if (success) {
      setPublishedData({ ...draftData });
      setHasUnsaved(false);
      // Sync to cloud Supabase if configured
      await syncToSupabase(draftData);
    }
    return success;
  };

  const resetToDefaults = () => {
    resetPortfolioDefaults();
    refreshData();
  };

  const toggleDraftPreview = () => {
    setIsDraftPreview((prev) => !prev);
  };

  // The active data displayed to the viewer (published or previewing draft)
  const activeData = isDraftPreview ? draftData : publishedData;

  return (
    <PortfolioContext.Provider
      value={{
        data: activeData,
        draftData,
        isDraftPreview,
        hasUnsaved,
        isAdminOpen,
        setDraftData,
        saveDraft,
        publish,
        resetToDefaults,
        toggleDraftPreview,
        openAdmin,
        closeAdmin,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return ctx;
}
