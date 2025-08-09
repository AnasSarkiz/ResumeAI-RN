import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { Resume, CoverLetter } from '../types/resume';

export const saveResume = async (resume: Resume): Promise<Resume> => {
  if (!resume.id) {
    throw new Error('resume.id is required');
  }
  await setDoc(doc(db, 'resumes', resume.id), resume);
  return resume;
};

export const getResumeById = async (resumeId: string): Promise<Resume> => {
  const docRef = doc(db, 'resumes', resumeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Resume not found');
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId: data.userId,
    title: data.title,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    website: data.website,
    linkedIn: data.linkedIn,
    github: data.github,
    summary: data.summary,
    experience: data.experience.map((exp: any) => ({
      id: exp.id,
      jobTitle: exp.jobTitle,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    })),
    education: data.education.map((edu: any) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
      description: edu.description,
    })),
    skills: data.skills.map((skill: any) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
    })),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

export const getResumes = async (userId: string): Promise<Resume[]> => {
  const q = query(collection(db, 'resumes'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      linkedIn: data.linkedIn,
      github: data.github,
      summary: data.summary,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  });
};

export const deleteResume = async (resumeId: string) => {
  await deleteDoc(doc(db, 'resumes', resumeId));
};

export const saveCoverLetter = async (coverLetter: CoverLetter): Promise<CoverLetter> => {
  await setDoc(doc(db, 'coverLetters', coverLetter.id), coverLetter);
  return coverLetter;
};

export const getCoverLetter = async (resumeId: string): Promise<CoverLetter> => {
  const q = query(collection(db, 'coverLetters'), where('resumeId', '==', resumeId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Cover letter not found');
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    resumeId: data.resumeId,
    content: data.content,
    company: data.company,
    position: data.position,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};
