import React, { useState } from 'react';
import { X, GraduationCap, School, BookOpen, Shield, CheckCircle2, UserCheck } from 'lucide-react';
import { ABUJA_SCHOOLS, ALL_CLASSES, ALL_DEPARTMENTS } from '../data/abujaSchools';
import { assignEquitableTeam, TEAMS_INFO } from '../data/teams';
import { UserProfile, UserRole, ClassLevel, Department, TeamType } from '../types';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser
}) => {
  const [role, setRole] = useState<UserRole>(currentUser.role || 'student');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [selectedSchool, setSelectedSchool] = useState(currentUser.school);
  const [customSchoolName, setCustomSchoolName] = useState(currentUser.isCustomSchool ? currentUser.school : '');
  const [classLevel, setClassLevel] = useState<ClassLevel>(currentUser.classLevel || 'SS1');
  const [department, setDepartment] = useState<Department>(currentUser.department || 'Science');
  const [teachingSubject, setTeachingSubject] = useState(currentUser.teachingSubject || 'General Mathematics');
  const [assignedTeam, setAssignedTeam] = useState<TeamType>(currentUser.team || 'Alpha');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const isOtherSchool = selectedSchool.startsWith('other') || selectedSchool === 'Others... (Type My School Name)';

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSchool(val);
    if (val !== 'Others... (Type My School Name)' && !val.startsWith('other')) {
      setCustomSchoolName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSchoolName = isOtherSchool
      ? (customSchoolName.trim() || 'Abuja Pioneer High School')
      : selectedSchool;

    // Determine equitable team assignment if not already set
    const equitableTeam = currentUser.team || assignEquitableTeam();
    setAssignedTeam(equitableTeam);

    const updatedUser: UserProfile = {
      ...currentUser,
      name: name.trim() || 'Abuja Scholar',
      email: email.trim() || 'scholar@schools.fct.gov.ng',
      role,
      school: finalSchoolName,
      isCustomSchool: isOtherSchool,
      classLevel,
      department,
      teachingSubject: role === 'teacher' ? teachingSubject : undefined,
      team: equitableTeam
    };

    onSaveUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const teamData = TEAMS_INFO[assignedTeam];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <School className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                Secondary School Sign Up & Profile
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Join your school and compete across Abuja in academic challenges
              </p>
            </div>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
            <p className="text-sm text-slate-300">
              You are assigned to <span className={`font-bold ${teamData.textColor}`}>{teamData.name}</span> {teamData.badgeIcon}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Registering As:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    role === 'student'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-900/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    role === 'teacher'
                      ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-md shadow-amber-900/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Teacher / Instructor</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'teacher' ? 'Mr. / Mrs. Ibrahim Hassan' : 'Aisha Bello'}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@schools.fct.gov.ng"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Abuja Secondary School Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Select Your School (Abuja, FCT)</span>
                <span className="text-[11px] text-emerald-400 font-semibold">12+ Top FCT Schools Included</span>
              </label>
              <select
                value={selectedSchool}
                onChange={handleSchoolChange}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                {ABUJA_SCHOOLS.map((school) => (
                  <option key={school.id} value={school.name}>
                    {school.name} {school.zone !== 'Custom' ? `(${school.zone} - ${school.type})` : ''}
                  </option>
                ))}
              </select>

              {/* Dynamic Others... Input */}
              {isOtherSchool && (
                <div className="mt-3 p-3.5 bg-slate-800/70 border border-emerald-500/40 rounded-xl">
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Enter Your School Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customSchoolName}
                    onChange={(e) => setCustomSchoolName(e.target.value)}
                    placeholder="e.g. Capital Science Academy, Kuje"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Your school will be indexed and ranked on the Intra-School & Inter-School leaderboards.
                  </span>
                </div>
              )}
            </div>

            {/* Conditional fields based on Student vs Teacher */}
            {role === 'student' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Class Level
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALL_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls} (Senior / Junior Secondary)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Academic Department / Track
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALL_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Subject Taught
                  </label>
                  <select
                    value={teachingSubject}
                    onChange={(e) => setTeachingSubject(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General Mathematics">General Mathematics</option>
                    <option value="English Studies">English Studies</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Civic Education">Civic Education</option>
                    <option value="Computer Studies">Computer Studies / Data Processing</option>
                    <option value="Economics">Economics</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Trade Subjects">Vocational & Trade Subjects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Class Handled
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ALL_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Team Distribution Notice */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{teamData.badgeIcon}</span>
                <div>
                  <span className="text-xs text-slate-400 block">Assigned Inter-Team (Equitably Balanced):</span>
                  <span className={`text-sm font-bold ${teamData.textColor}`}>{teamData.name}</span>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                Auto-Balanced
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-700/30 transition flex items-center justify-center gap-2"
              >
                <span>Save Profile & Enter Arena</span>
                <span>→</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
