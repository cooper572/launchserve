import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Form state
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<string>('');
  const [timeCommitment, setTimeCommitment] = useState<string>('');

  const interestOptions = [
    'Environment', 'Education', 'Technology', 'Animals', 'Community Service',
    'Health & Wellness', 'Arts & Culture', 'Social Justice'
  ];

  const skillOptions = [
    'Teaching', 'Coding', 'Writing', 'Design', 'Public Speaking',
    'Organization', 'Leadership', 'Communication'
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to save preferences');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const age = year ? new Date().getFullYear() - parseInt(year) : undefined;

      // Use upsert to handle both insert and update cases
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          age,
          interests,
          causes: interests, // Using interests as causes for simplicity
          skills,
          location_types: locationType ? [locationType] : [],
          time_commitment: timeCommitment,
          preferred_locations: city ? [city] : [],
          availability_days: [],
          volunteer_goals: [],
          previous_volunteer: false,
          onboarding_completed: true
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setError(err.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1 w-full max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="space-y-8">
          {/* Progress Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Profile Setup</span>
              <span className="text-sm font-medium text-slate-500">Step {step} of 3</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 animate-slide-up">
            <div className="p-8 sm:p-10">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Birthday & Location */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Let's get to know you</h1>
                    <p className="text-base text-slate-600">
                      We use your age and location to find volunteer events that you are eligible for and that are close to home.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Date of Birth */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-900">
                        When is your birthday?
                      </label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <select
                          className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 focus:border-primary focus:bg-white focus:ring-primary sm:text-sm"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
                          ))}
                        </select>
                        <select
                          className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 focus:border-primary focus:bg-white focus:ring-primary sm:text-sm"
                          value={day}
                          onChange={(e) => setDay(e.target.value)}
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <select
                          className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-slate-900 focus:border-primary focus:bg-white focus:ring-primary sm:text-sm"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 11 }, (_, i) => (
                            <option key={2011 - i} value={2011 - i}>{2011 - i}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        You must be between 13-18 years old to join.
                      </p>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-900">
                        Where are you located?
                      </label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="relative group">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary">location_city</span>
                          </div>
                          <input
                            className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-10 text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:ring-primary sm:text-sm"
                            placeholder="City"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="relative group">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary">public</span>
                          </div>
                          <select
                            className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-slate-900 focus:border-primary focus:bg-white focus:ring-primary sm:text-sm"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option value="">Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicator */}
                    <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4">
                      <div className="rounded-full bg-emerald-100 p-1">
                        <span className="material-symbols-outlined text-emerald-600 text-sm">security</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-800">Your privacy matters</h4>
                        <p className="text-xs text-emerald-700 mt-0.5">We only share your general location with nonprofits to find nearby events. Your exact birthday stays private.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">What interests you?</h1>
                    <p className="text-base text-slate-600">
                      Select the causes you're passionate about. We'll match you with relevant opportunities.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                          interests.includes(interest)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Preferences */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your skills & preferences</h1>
                    <p className="text-base text-slate-600">
                      Tell us about your skills and how you'd like to volunteer.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Skills */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-900">
                        What skills do you have?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {skillOptions.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              skills.includes(skill)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location Type */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-900">
                        Preferred location type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['In-Person', 'Remote', 'Hybrid'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setLocationType(type)}
                            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              locationType === type
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Commitment */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-900">
                        Time commitment
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['1-2 hours/week', '3-5 hours/week', '5-10 hours/week', 'Flexible'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setTimeCommitment(time)}
                            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              timeCommitment === time
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row-reverse sm:justify-between">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all duration-200"
                  >
                    Continue
                    <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Find Opportunities'}
                    {!loading && <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>}
                  </button>
                )}
                <button
                  onClick={step > 1 ? () => setStep(step - 1) : handleSkip}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {step > 1 ? 'Back' : 'Skip for now'}
                </button>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
