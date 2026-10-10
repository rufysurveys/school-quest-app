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
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ExternalLink
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
  isGated: boolean; // If true, cannot close without registering
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthenticationSuccess,
  isGated
}) => {
  // Step 1 = Details, Step 2 = Email Verification, Step 3 = Confirmed
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');

  // Form Fields
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

  // Verification state
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    setTimeout(() => {
      onAuthenticationSuccess(verifiedProfile);
      if (onClose) onClose();
    }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button (only if not gated) */}
        {!isGated && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 hover:bg-slate-200 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: REGISTRATION FORM */}
        {step === 'form' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <School className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    Create Your Account & Join Your School
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Registration is required to access the FCT Secondary Schools Learning Arena
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-4">
              
              {/* Role Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Register As:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition ${
                      role === 'student'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition ${
                      role === 'teacher'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>Teacher / Instructor</span>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'teacher' ? 'Mr. / Mrs. Ibrahim Hassan' : 'Aisha Bello'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for Verification Code)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@schools.fct.gov.ng"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* School Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Select Secondary School (Abuja, FCT)</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Includes Little Sprout, Deeper Life, etc.</span>
                </label>
                <select
                  value={selectedSchool}
                  onChange={handleSchoolChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                >
                  {ABUJA_SCHOOLS.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name} {school.zone !== 'Custom' ? `(${school.zone} - ${school.type})` : ''}
                    </option>
                  ))}
                </select>

                {isOtherSchool && (
                  <div className="mt-2.5 p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl">
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      Enter Your Custom School Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={customSchoolName}
                      onChange={(e) => setCustomSchoolName(e.target.value)}
                      placeholder="e.g. Model Academy, Gwagwalada"
                      className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}
              </div>

              {/* Role specific class & department fields */}
              {role === 'student' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class Level
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    >
                      {ALL_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department / Academic Track
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as Department)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Subject Handled
                    </label>
                    <select
                      value={teachingSubject}
                      onChange={(e) => setTeachingSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
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
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class Supervised
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    >
                      {ALL_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {otpError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email Confirmation Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: EMAIL VERIFICATION (OTP) & CONFIRMATION */}
        {step === 'verification' && (
          <div className="space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                Confirm Your Email Address
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                We have sent an official verification code to <strong className="text-slate-900">{email}</strong>. Enter the 6-digit code below to activate your account.
              </p>
            </div>

            {/* Simulated Email Notification Card */}
            {showSimulatedEmailDrawer && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-amber-900">Simulated Inbox: Official FCT Exam Board Email</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Just Now
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-900">
                    Subject: Activate Your FCT Secondary Schools Quest Account
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Hello <strong>{name || 'Scholar'}</strong>, your confirmation code for <strong>{selectedSchool}</strong> is:
                  </p>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-300">
                  <span className="font-mono text-xl font-black tracking-widest text-emerald-700">
                    {generatedOtp}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredOtp(generatedOtp);
                      finalizeVerification();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition"
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
                <label className="block text-xs font-bold text-slate-700 text-center mb-2 uppercase tracking-wider">
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
                  className="w-full text-center tracking-widest font-mono text-2xl font-black py-3 bg-slate-50 border-2 border-emerald-500/50 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                  {otpError}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Activate Account</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-slate-500 hover:text-slate-800 font-medium underline"
                >
                  ← Edit Registration Info
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

        {/* STEP 3: SUCCESS ANIMATION */}
        {step === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
            <h3 className="text-2xl font-black text-slate-900 font-display">
              Account Confirmed & Activated!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm">
              Welcome to the FCT Secondary Schools Quest. You have been equitably assigned to:
            </p>
            <div className={`p-4 rounded-2xl border ${teamInfo.borderColor} bg-slate-50 max-w-xs w-full flex items-center justify-center gap-2`}>
              <span className="text-2xl">{teamInfo.badgeIcon}</span>
              <span className="font-bold text-slate-900">{teamInfo.name}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
