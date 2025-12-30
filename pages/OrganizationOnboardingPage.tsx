import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const OrganizationOnboardingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !organizationName) {
      return setError('Please fill in all required fields');
    }

    if (!user) {
      return setError('You must be logged in');
    }

    setLoading(true);

    try {
      let logoUrl = '';

      // Upload logo if provided
      if (logoFile) {
        try {
          const fileExt = logoFile.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('organization-logos')
            .upload(fileName, logoFile);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            // If bucket doesn't exist, continue without logo
            if (uploadError.message?.includes('Bucket not found')) {
              setError('Logo upload is not configured yet. Continuing without logo...');
              // Continue without logo
            } else {
              throw uploadError;
            }
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('organization-logos')
              .getPublicUrl(fileName);

            logoUrl = publicUrl;
          }
        } catch (err) {
          console.error('Logo upload error:', err);
          // Continue without logo if upload fails
        }
      }

      // Create organization profile
      const { error: profileError } = await supabase
        .from('organization_profiles')
        .insert({
          user_id: user.id,
          username,
          organization_name: organizationName,
          logo_url: logoUrl,
        });

      if (profileError) {
        throw profileError;
      }

      // Redirect to organization dashboard
      navigate('/organization-dashboard');
    } catch (err: any) {
      console.error('Error creating organization profile:', err);
      setError(err.message || 'Failed to create organization profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-4xl">business</span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Organization Setup
              </h1>
            </div>
            <p className="text-slate-600 text-base">
              Complete your organization profile to start posting volunteer opportunities.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900" htmlFor="username">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., greenearth_foundation"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
                required
              />
              <p className="text-xs text-slate-500">This will be your unique identifier on the platform</p>
            </div>

            {/* Organization Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900" htmlFor="organizationName">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g., GreenEarth Foundation"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
                required
              />
            </div>

            {/* Logo Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-900" htmlFor="logo">
                Organization Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 flex-shrink-0">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label
                  htmlFor="logo"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-slate-400">upload</span>
                  <span className="text-sm font-medium text-slate-600">
                    {logoFile ? 'Change Logo' : 'Upload Logo'}
                  </span>
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-500">Recommended: Square image, at least 200x200px</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Setting up...' : 'Complete Setup'}</span>
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOnboardingPage;
