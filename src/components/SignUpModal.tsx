import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  GraduationCap, 
  School, 
  CheckCircle2, 
  UserCheck, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Trophy,
  ShieldCheck,
  Flame,
  Users
} from 'lucide-react';
import { ABUJA_SCHOOLS, ALL_CLASSES, ALL_DEPARTMENTS } from '../data/abujaSchools';
import { assignEquitableTeam, TEAMS_INFO } from '../data/teams';
import { UserProfile, UserRole, ClassLevel, Department, TeamType } from '../types';
import { generateVerificationCode, saveUserProfile } from '../utils/gamification';

interface SignUpModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: UserProfile | null;
  onAuthenticationSuccess: (user: UserProfile) => void;
  isGated: boolean;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthenticationSuccess,
  isGated
}) => {
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');

  // Form fields
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(currentUser?.school || 'Loyola Jesuit College, Abuja');
  const [customSchoolName, setCustomSchoolName] = useState(currentUser?.isCustomSchool ? currentUser.school : '');
  const [classLevel, setClassLevel] = useState<ClassLevel>(currentUser?.classLevel || 'SS1');
  const [department, setDepartment] = useState<Department>(currentUser?.department || 'Science');
  const [teachingSubject, setTeachingSubject] = useState(currentUser?.teachingSubject || 'General Mathematics');

  // Verification
  const [generatedOtp, setGeneratedOtp] = useState<string>('582910');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showSimulatedEmailDrawer, setShowSimulatedEmailDrawer] = useState<boolean>(true);
  const [assignedTeam, setAssignedTeam] = useState<TeamType>('Alpha');

  if (!isOpen) return null;

  const isOtherSchool = selectedSchool.startsWith('other') || selectedSchool === 'Others... (Type My School Name)';

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSchool(val);
    if (val !== 'Others... (Type My School Name)' && !val.startsWith('other')) {
      setCustomSchoolName('');
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && confirmPassword && password !== confirmPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    const code = generateVerificationCode();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError(null);
    setShowSimulatedEmailDrawer(true);
    setStep('verification');
  };

  const finalizeVerification = () => {
    const finalSchoolName = isOtherSchool
      ? (customSchoolName.trim() || 'Abuja International Academy')
      : selectedSchool;

    const team = currentUser?.team || assignEquitableTeam();
    setAssignedTeam(team);

    const verifiedProfile: UserProfile = {
      id: currentUser?.id || 'usr-' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || (role === 'teacher' ? 'Instructor Ibrahim' : 'Aisha Bello'),
      email: email.trim() || 'scholar@schools.fct.gov.ng',
      password: password || undefined,
      role,
      school: finalSchoolName,
      isCustomSchool: isOtherSchool,
      classLevel,
      department,
      teachingSubject: role === 'teacher' ? teachingSubject : undefined,
      xp: currentUser?.xp || 1500,
      streak: currentUser?.streak || 5,
      lastActiveDate: new Date().toISOString(),
      level: currentUser?.level || 2,
      badges: currentUser?.badges || ['🌱 Novice Scholar', '📘 Junior Specialist', '🔥 5-Day Streak'],
      team,
      bookmarks: currentUser?.bookmarks || [],
      isVerified: true
    };

    saveUserProfile(verifiedProfile);
    setStep('success');

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    setTimeout(() => {
      onAuthenticationSuccess(verifiedProfile);
      if (onClose) onClose();
    }, 1600);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp.trim()) {
      finalizeVerification();
    } else {
      setOtpError('Invalid 6-digit confirmation code. Please check your email.');
    }
  };

  const handleResendCode = () => {
    const code = generateVerificationCode();
    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpError(null);
    setShowSimulatedEmailDrawer(true);
  };

  const teamInfo = TEAMS_INFO[assignedTeam];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      
      {/* Dynamic Background Image with subtle atmospheric overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url('/signup_bg.jpg')` }}
      />
      
      {/* Dual Gradient Overlay to maintain brightness and readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/75 via-emerald-950/50 to-slate-900/80 backdrop-blur-[6px]" />

      {/* Main Glassmorphic Modal Container */}
      <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[32px] shadow-2xl text-slate-800 overflow-hidden my-auto z-10 animate-fadeIn">
        
        {/* Close Button (if permitted) */}
        {!isGated && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100/80 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Sidebar Panel: Image showcase & Highlights */}
          <div className="lg:col-span-5 relative p-6 sm:p-8 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 text-white flex flex-col justify-between overflow-hidden">
            
            {/* Background subtle pattern glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge & Header */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-amber-300 text-xs font-black tracking-wide">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL FCT ACADEMIC LEAGUE</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display leading-tight">
                  Your Classroom is Now a Game Arena.
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
                  Join secondary school students across Abuja to compete, practice topics, and level up together.
                </p>
              </div>

              {/* Highlighting Key Features */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                  <span className="text-2xl">🦅</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tri-Team Equitable Battles</h4>
                    <p className="text-[11px] text-emerald-200">Balanced into Team Alpha, Beta, or Omega</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% Scheme of Work</h4>
                    <p className="text-[11px] text-emerald-200">SS1, SS2 & SS3 FCT Curriculum coverage</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                  <span className="text-2xl">📹</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Proctored AI Integrity</h4>
                    <p className="text-[11px] text-emerald-200">WebRTC focus & biometric exam monitoring</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Abuja Schools preview ticker */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1.5">
                Competing Abuja Schools
              </span>
              <p className="text-xs text-white/80 line-clamp-2">
                Little Sprout • Destiny Christian • Deeper Life High • Faith Academy • Stella Maris • Word of Faith • The Regent • Premiere Academy • FGBC Apo • FGGC Bwari • GSS Garki
              </p>
            </div>

          </div>

          {/* Right Panel: Interactive Step-by-Step Registration & Email OTP */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            
            {/* STEP 1: REGISTRATION DETAILS */}
            {step === 'form' && (
              <div className="space-y-4">
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Sign Up & Choose Your School
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step 1 of 2: Create profile and select school
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-3.5">
                  
                  {/* Role Switcher */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition ${
                        role === 'student'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Sign up as Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition ${
                        role === 'teacher'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md shadow-amber-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Sign up as Teacher</span>
                    </button>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'teacher' ? 'Mr. / Mrs. Ibrahim' : 'Aisha Bello'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address (for Code)
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@schools.fct.gov.ng"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                      />
                    </div>
                  </div>

                  {/* Secondary School Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Select Abuja Secondary School</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold">All 12+ Schools Listed</span>
                    </label>
                    <select
                      value={selectedSchool}
                      onChange={handleSchoolChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                    >
                      {ABUJA_SCHOOLS.map((school) => (
                        <option key={school.id} value={school.name}>
                          {school.name} {school.zone !== 'Custom' ? `(${school.zone} - ${school.type})` : ''}
                        </option>
                      ))}
                    </select>

                    {isOtherSchool && (
                      <div className="mt-2.5 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <label className="block text-xs font-black text-emerald-900 mb-1">
                          Enter School Name:
                        </label>
                        <input
                          type="text"
                          required
                          value={customSchoolName}
                          onChange={(e) => setCustomSchoolName(e.target.value)}
                          placeholder="e.g. Model High School, Bwari"
                          className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Class Level & Department */}
                  {role === 'student' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Class Level
                        </label>
                        <select
                          value={classLevel}
                          onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                        >
                          {ALL_CLASSES.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Department / Stream
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value as Department)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                        >
                          {ALL_DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary Subject
                        </label>
                        <select
                          value={teachingSubject}
                          onChange={(e) => setTeachingSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
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
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Class Handled
                        </label>
                        <select
                          value={classLevel}
                          onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs transition"
                        >
                          {ALL_CLASSES.map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {otpError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Confirmation Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* STEP 2: EMAIL VERIFICATION (OTP) */}
            {step === 'verification' && (
              <div className="space-y-5">
                
                <div className="text-center space-y-1">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Confirm Your Email Address
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We sent an official 6-digit confirmation code to <strong className="text-slate-900">{email}</strong>.
                  </p>
                </div>

                {/* Simulated Email Inbox Preview */}
                {showSimulatedEmailDrawer && (
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-slate-700 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span>Incoming Message • FCT Secondary Schools Board</span>
                      </div>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-full">
                        Just Now
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                      Hello <strong>{name || 'Scholar'}</strong>! Your one-time verification code for <strong>{selectedSchool}</strong> is:
                    </p>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-300 shadow-2xs">
                      <span className="font-mono text-2xl font-black tracking-widest text-emerald-700">
                        {generatedOtp}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEnteredOtp(generatedOtp);
                          finalizeVerification();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <span>Click to Confirm Account</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Code Input Form */}
                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 text-center uppercase tracking-wider mb-2">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 582910"
                      className="w-full text-center tracking-widest font-mono text-3xl font-black py-3 bg-slate-50 border-2 border-emerald-400 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
                    />
                  </div>

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Activate Account</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="text-slate-500 hover:text-slate-800 font-semibold underline"
                    >
                      ← Back to Details
                    </button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Resend Code</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 'success' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Account Confirmed & Ready!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                  Welcome to the arena! You have been equitably placed in:
                </p>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 max-w-xs w-full flex items-center justify-center gap-2 shadow-sm">
                  <span className="text-2xl">{teamInfo.badgeIcon}</span>
                  <span className="font-bold text-slate-900">{teamInfo.name}</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
