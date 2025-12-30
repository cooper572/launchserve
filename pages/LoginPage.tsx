import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const LoginPage: React.FC = () => {
  const [accountType, setAccountType] = useState<'volunteer' | 'organization' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accountType) {
      return setError('Please select an account type');
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // Handle specific error cases
        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please confirm your email before logging in. Check your inbox.');
        } else if (error.status === 429) {
          setError('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          setError(error.message || 'Failed to sign in');
        }
      } else {
        // Check account type and redirect accordingly
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const userAccountType = userData.user.user_metadata?.account_type;

          // Verify the selected account type matches the user's actual account type
          if (userAccountType !== accountType) {
            setError(`This account is registered as a ${userAccountType}. Please select the correct account type.`);
            setLoading(false);
            return;
          }

          if (accountType === 'organization') {
            // Check if organization profile exists
            const { data: orgProfile } = await supabase
              .from('organization_profiles')
              .select('*')
              .eq('user_id', userData.user.id)
              .single();

            if (orgProfile) {
              navigate('/organization-dashboard');
            } else {
              navigate('/organization-onboarding');
            }
          } else {
            // Volunteer account - check onboarding status
            const { data: preferences } = await supabase
              .from('user_preferences')
              .select('onboarding_completed')
              .eq('user_id', userData.user.id)
              .single();

            if (preferences?.onboarding_completed) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          }
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section: Visual / Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-100 overflow-hidden flex-col justify-end p-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="Group of diverse teenagers volunteering outdoors together"
            className="w-full h-full object-cover opacity-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2M2TV0MSgedYfLQIo9fDnn8PkVeqZrwx2iMb7PoNyY_AIGBgjiNGLPsWIaD1XuTI0bfHnSnC4p7i3J69_5S2VosSCBnJXkoVuVJDUlRaSfMgPQq-iDiYu9dZfCt_aB1DLM6wDR5_G1hgzH51_YwtwHeue5F2WgeA1u7nlPekaS9tXqSdeiCjfG5yz0ksiXOP2mWWgJ4TTNK0Y3oZRrBCwIhUPxmEcLatGejrqpFSafEMI6tvyn3MoX99r-lt33Y_BBdAL5rjxjnuB"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px] text-green-400">volunteer_activism</span>
            Student Impact
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Empower Your Community today.
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed">
            Connect with local nonprofits and find meaningful volunteer opportunities that fit your schedule and interests.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="flex -space-x-3 overflow-hidden">
              <img alt="Student volunteer" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXXHW4pZ7H5_X925OypuwZYvm7GOgP-xIBcRuZa5P-ii5vFdFtCFTiCGRYw_qMRD385itpPl1A9GJDLIcycVAUR7-nLtCx2ZRV1Gzq40EKWB2yD-L74s8lYZ4C1X-7_Uu5bdM__wXQuJ7FkJBTpv1PzcmvmoCY1MVblWZIyDmpFL0FlPZNsyGlytoLlxhkv7Owm3ZN7Dh0VQu6yMikd3qBJYhiTdy6iMdq9FkB9ld5DhruPw96ZzkrJs2iDmaULI4_jRu7azIuy3PE" />
              <img alt="Student volunteer" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9sqnisHJVelmSBtrG9sKlDwLK2_SPZGoB6km-uiwjwzH8LkNVS2lanGg7Szxqz1sRF21H81dFuBrpfGqFdnqogQ8PDpv1cYDnkmqbZpUj2q_8eabFGFpNIMjFuZs_Wze5hW3nwChhvb73onQZuXXf2w3brlrio1SqM2X6hnBuTbLnfQFt88CF1pBkcFcKvcmadSaSV5gjrMew5RZ6XQjgoR5_B6FckoRlMr_Gi-oi_Q3l8dVovd1a6YmbZekQkEcN-x02D6j9R9NK" />
              <img alt="Student volunteer" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiSPx_SCzpMLVqOhbWfoynAtRQ1g09QAYz78ULv2BWUaEgmzl3xZvJoFnEDzR4wXkz8LEO08q1sZ7XsSyUyQiWn07HggdB7xcMarzGaTF8sl6K8S-X8OXizC7SspiohN-TWtC532ru_YZ00DerzqykbWp0uSHw-KKH3_KLgvQIzzoFrDzy06UMgHC5StCaJ-A0jLO4vBDtyiqbr26scdclJi5aS8fl2_TQg0xqXU7KRxfq1LI1EiV6ypBSAU4wBwK08RRl4brGDfgu" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-white text-xs font-bold">1,200+ Students</span>
              <span className="text-white/60 text-xs">Making a difference</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-12 py-20 bg-white relative">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-600 text-base">
              Log in to access your volunteer dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Account Type Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-900">I am logging in as:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('volunteer')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    accountType === 'volunteer'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl mb-2 block text-primary">
                    volunteer_activism
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">Volunteer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('organization')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    accountType === 'organization'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl mb-2 block text-primary">
                    business
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">Organization</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
                  id="email"
                  placeholder="student@school.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-900" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          {/* Footer Sign Up */}
          <p className="text-center text-sm text-slate-600">
            Don't have an account?
            <Link to="/signup" className="font-bold text-secondary hover:text-green-600 ml-1 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
