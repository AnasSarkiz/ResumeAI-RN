import React, { createContext, useContext, useEffect, useState } from 'react';
import { Resume, CoverLetter } from '../types/resume';
import { getResumes, getResumeById, saveResume, deleteResume, getCoverLetter } from '../services/resume';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  currentCoverLetter: CoverLetter | null;
  loading: boolean;
  error: string | null;
  loadResumes: (userId: string) => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  createResume: (userId: string, title: string) => Promise<Resume>;
  updateResume: (resumeId: string, updates: Partial<Resume>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  loadCoverLetter: (resumeId: string) => Promise<void>;
  generateCoverLetter: (resumeId: string, company?: string, position?: string) => Promise<CoverLetter>;
}

const ResumeContext = createContext<ResumeContextType>({
  resumes: [],
  currentResume: null,
  currentCoverLetter: null,
  loading: false,
  error: null,
  loadResumes: async () => {},
  loadResume: async () => {},
  createResume: async () => ({ id: '', userId: '', title: '', fullName: '', email: '', experience: [], education: [], skills: [], createdAt: new Date(), updatedAt: new Date() }),
  updateResume: async () => {},
  deleteResume: async () => {},
  loadCoverLetter: async () => {},
  generateCoverLetter: async () => ({ id: '', resumeId: '', content: '', createdAt: new Date(), updatedAt: new Date() }),
});

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResumes = async (userId: string) => {
    setLoading(true);
    try {
      const userResumes = await getResumes(userId);
      setResumes(userResumes);
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async (resumeId: string) => {
    setLoading(true);
    try {
      const resume = await getResumeById(resumeId);
      setCurrentResume(resume);
    } catch (err) {
      setError('Failed to load resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (userId: string, title: string) => {
    setLoading(true);
    try {
      const newResume = await saveResume({
        userId,
        title,
        fullName: '',
        email: '',
        experience: [],
        education: [],
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        id: ''
      });
      setResumes(prev => [...prev, newResume]);
      return newResume;
    } catch (err) {
      setError('Failed to create resume');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (resumeId: string, updates: Partial<Resume>) => {
    setLoading(true);
    try {
      const updatedResume = await saveResume({
        ...(currentResume || {}),
        ...updates,
        id: resumeId,
        updatedAt: new Date(),
      } as Resume);
      
      setCurrentResume(updatedResume);
      setResumes(prev => prev.map(r => r.id === resumeId ? updatedResume : r));
    } catch (err) {
      setError('Failed to update resume');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (resumeId: string) => {
    setLoading(true);
    try {
      await deleteResume(resumeId);
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      if (currentResume?.id === resumeId) {
        setCurrentResume(null);
      }
    } catch (err) {
      setError('Failed to delete resume');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadCoverLetter = async (resumeId: string) => {
    setLoading(true);
    try {
      const coverLetter = await getCoverLetter(resumeId);
      setCurrentCoverLetter(coverLetter);
    } catch (err) {
      setError('Failed to load cover letter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async (resumeId: string, company?: string, position?: string) => {
    setLoading(true);
    try {
      // const { generateCoverLetter } = await import('../services/ai');
      const resume = currentResume || await getResumeById(resumeId);
      // const content = await generateCoverLetter(resume, company, position);
      const content = `Cover letter content for ${resume.fullName} applying to ${position || 'a position'} at ${company || 'the company'}.`; // Placeholder for actual AI generation logic
      
      const coverLetter: CoverLetter = {
        id: `${resumeId}-${Date.now()}`,
        resumeId,
        content,
        company,
        position,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setCurrentCoverLetter(coverLetter);
      return coverLetter;
    } catch (err) {
      setError('Failed to generate cover letter');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      currentResume,
      currentCoverLetter,
      loading,
      error,
      loadResumes,
      loadResume,
      createResume,
      updateResume,
      deleteResume,
      loadCoverLetter,
      generateCoverLetter,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);