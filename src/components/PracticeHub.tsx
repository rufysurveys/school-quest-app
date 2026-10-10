import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Compass, 
  Play, 
  Clock, 
  ChevronRight, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SCHEME_QUESTIONS, SUBJECT_TOPICS } from '../data/schemeQuestions';
import { ClassLevel } from '../types';

interface PracticeHubProps {
  onStartQuiz: (options: {
    subject?: string;
    topic?: string;
    classLevel?: ClassLevel;
    term?: 1 | 2 | 3;
    isProctored?: boolean;
    modeTitle?: string;
  }) => void;
  userClass: ClassLevel;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onStartQuiz,
  userClass
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('General Mathematics');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(userClass || 'SS1');

  const allSubjects = Object.keys(SUBJECT_TOPICS);
  const currentTopics = SUBJECT_TOPICS[selectedSubject] || [];

  const filteredTopics = currentTopics.filter(topic =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQuestionCountForTopic = (subject: string, topic: string) => {
    return SCHEME_QUESTIONS.filter(q => q.subject === subject && q.topic === topic).length;
  };

  const handleJumpToTopic = (topic: string) => {
    onStartQuiz({
      subject: selectedSubject,
      topic: topic,
      classLevel: selectedClass,
      term: selectedTerm,
      isProctored: false,
      modeTitle: `Practice: ${selectedSubject} • ${topic}`
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Practice Header & Topic Jump Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Self-Paced Mastery & Topic Navigator</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-display">
              Official FCT Scheme Practice Hub
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore syllabus topics in depth. Use the <strong className="text-emerald-700">Topic Jumper</strong> to instantly navigate between subjects and curriculum units without restriction.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-600">100%</span>
              <p className="text-[11px] text-slate-500 font-medium">Scheme Covered</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <span className="text-2xl font-black text-amber-600">{allSubjects.length}</span>
              <p className="text-[11px] text-slate-500 font-medium">Core Subjects</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <span className="text-2xl font-black text-blue-600">{SCHEME_QUESTIONS.length}+</span>
              <p className="text-[11px] text-slate-500 font-medium">Quest Items</p>
            </div>
          </div>
        </div>

        {/* Global Topic Jumper Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-amber-500" /> Quick Topic Jump:
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-600 w-full sm:w-auto shadow-sm"
            >
              {allSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Class filter */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {(['SS1', 'SS2', 'SS3'] as ClassLevel[]).map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedClass === cls
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Term filter */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {([1, 2, 3] as const).map(termNum => (
                <button
                  key={termNum}
                  onClick={() => setSelectedTerm(termNum)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedTerm === termNum
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Term {termNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Subject Selector Sidebar + Topic Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Subjects Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Select Subject
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">{allSubjects.length} Available</span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {allSubjects.map((subject) => {
              const isSelected = selectedSubject === subject;
              const topicCount = SUBJECT_TOPICS[subject]?.length || 0;
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {subject.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[170px] text-slate-900">{subject}</p>
                      <p className="text-[11px] text-slate-500">{topicCount} Topics in Scheme</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick full subject practice button */}
          <button
            onClick={() => {
              onStartQuiz({
                subject: selectedSubject,
                classLevel: selectedClass,
                term: selectedTerm,
                isProctored: false,
                modeTitle: `Full Subject Practice: ${selectedSubject} (${selectedClass})`
              });
            }}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice All {selectedSubject} Topics</span>
          </button>
        </div>

        {/* Right Column: Topic Jumper & Cards */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search within current subject topics */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedSubject} topics (e.g., indices, cell, forces...)`}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
              />
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              Showing {filteredTopics.length} topics
            </span>
          </div>

          {/* Grid of Topics for selected subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTopics.map((topic, index) => {
              const qCount = getQuestionCountForTopic(selectedSubject, topic);
              return (
                <div
                  key={topic}
                  className="group bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                        Unit #{index + 1}
                      </span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> Self-paced
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {topic}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      FCT Curriculum aligned • Term {selectedTerm} • Includes conceptual explanations, exam drills & review cards.
                    </p>
                  </div>

                  {/* Jump button */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {qCount > 0 ? `${qCount} Quest Questions` : 'Core Scheme Topic'}
                    </span>
                    <button
                      onClick={() => handleJumpToTopic(topic)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <span>Jump Here</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-700 font-bold">No matching topics found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
