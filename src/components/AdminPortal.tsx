import React, { useState } from 'react';
import { 
  Settings, 
  PlusCircle, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  School,
  X
} from 'lucide-react';
import { SCHEME_QUESTIONS } from '../data/schemeQuestions';
import { INITIAL_STUDENT_LEADERBOARD } from '../data/leaderboards';
import { Question, ClassLevel } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose
}) => {
  const [questionsList, setQuestionsList] = useState<Question[]>(SCHEME_QUESTIONS);
  const [newSubject, setNewSubject] = useState('General Mathematics');
  const [newClass, setNewClass] = useState<ClassLevel>('SS1');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newTopic.trim()) return;

    const newQ: Question = {
      id: `custom-${Date.now()}`,
      subject: newSubject,
      classLevel: newClass,
      term: 1,
      topic: newTopic,
      question: newQuestionText,
      options: [optionA || 'Option A', optionB || 'Option B', optionC || 'Option C', optionD || 'Option D'],
      correctAnswer: correctOptionIdx,
      explanation: explanation || 'Curriculum aligned solution provided by school instructor.'
    };

    setQuestionsList([newQ, ...questionsList]);
    setNotification('New question added to FCT Teaching Scheme repository!');
    setNewQuestionText('');
    setNewTopic('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'School', 'Class', 'Team', 'XP', 'Accuracy%'];
    const rows = INITIAL_STUDENT_LEADERBOARD.map(s => [
      s.rank,
      `"${s.name}"`,
      `"${s.school}"`,
      s.classLevel,
      s.team,
      s.xp,
      s.accuracy
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FCT_Secondary_Performance_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Performance report exported as CSV!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
        
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Settings className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Instructor & Admin Management Portal
            </h2>
            <p className="text-xs text-slate-400">
              Manage FCT curriculum questions, export school academic metrics, and supervise teams
            </p>
          </div>
        </div>

        {notification && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleExportCSV}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 flex items-center justify-between text-left transition"
          >
            <div>
              <p className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5 mb-1">
                <Download className="w-4 h-4" /> Export Analytics
              </p>
              <h4 className="text-sm font-bold text-white">Export Performance CSV</h4>
              <p className="text-xs text-slate-400">Download student scores & school rankings</p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 font-bold">
              Download
            </span>
          </button>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4" /> Repository Count
              </p>
              <h4 className="text-sm font-bold text-white">{questionsList.length} Scheme Questions</h4>
              <p className="text-xs text-slate-400">Covering SS1, SS2, and SS3 Teaching Schemes</p>
            </div>
          </div>
        </div>

        {/* Add Question Section */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" /> Add Question to Scheme Database
          </h3>

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="General Mathematics">General Mathematics</option>
                  <option value="English Studies">English Studies</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Civic Education">Civic Education</option>
                  <option value="Computer Studies">Computer Studies</option>
                  <option value="Economics">Economics</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Class Level</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value as ClassLevel)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="SS1">SS1</option>
                  <option value="SS2">SS2</option>
                  <option value="SS3">SS3</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Topic in Scheme</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Logarithms (II)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Question Prompt</label>
              <textarea
                required
                rows={2}
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter full question text here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Correct Answer</label>
                <select
                  value={correctOptionIdx}
                  onChange={(e) => setCorrectOptionIdx(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Explanation / Pedagogical Note</label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why is this answer correct?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save Question to Scheme Bank</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
