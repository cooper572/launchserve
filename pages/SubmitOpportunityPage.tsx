import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { supabase, uploadImage } from '../supabaseClient';
import { frontendToDb } from '../types';
import { useAuth } from '../contexts/AuthContext';
import '../editor.css';
import '../animations.css';

interface FormData {
  organization: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  title: string;
  formLink: string;
  shortDescription: string;
  fullDescription: string;
  tags: string;
  type: 'In-Person' | 'Remote' | 'Hybrid';
  location: string;
  timeCommitment: string;
  timeCommitmentUnit: string;
  ageMin: number;
  ageMax: number;
  requirements: string;
}

const SubmitOpportunityPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    organization: '', contactEmail: '', contactPhone: '', website: '',
    facebook: '', instagram: '', twitter: '', linkedin: '',
    title: '', formLink: '', shortDescription: '', fullDescription: '',
    tags: '', type: 'In-Person', location: '', timeCommitment: '',
    timeCommitmentUnit: 'hours/week', ageMin: 13, ageMax: 18, requirements: '',
  });

  useEffect(() => {
    // Pre-fill organization details if user is an organization
    const loadOrganizationData = async () => {
      if (!user) return;

      const accountType = user.user_metadata?.account_type;
      if (accountType === 'organization') {
        const { data, error } = await supabase
          .from('organization_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setFormData(prev => ({
            ...prev,
            organization: data.organization_name,
            contactEmail: user.email || '',
          }));
        }
      }
    };

    loadOrganizationData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: 'In-Person' | 'Remote' | 'Hybrid') => {
    setFormData(prev => ({ ...prev, type, location: type === 'Remote' ? 'Online' : prev.location }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'icon') {
          setIconPreview(reader.result as string);
          setIconFile(file);
        } else {
          setThumbnailPreview(reader.result as string);
          setThumbnailFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Upload images to Supabase Storage
      let iconUrl = '';
      let thumbnailUrl = '';
      
      if (iconFile) {
        const url = await uploadImage(iconFile, 'icons');
        if (url) iconUrl = url;
      }
      
      if (thumbnailFile) {
        const url = await uploadImage(thumbnailFile, 'thumbnails');
        if (url) thumbnailUrl = url;
      }

      // Prepare opportunity data
      const opportunityData = {
        ...frontendToDb({
          organization: formData.organization,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone || undefined,
          website: formData.website || undefined,
          socialMedia: {
            facebook: formData.facebook || undefined,
            instagram: formData.instagram || undefined,
            twitter: formData.twitter || undefined,
            linkedin: formData.linkedin || undefined,
          },
          title: formData.title,
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription,
          ageRange: { min: formData.ageMin, max: formData.ageMax },
          timeCommitment: formData.timeCommitment,
          location: formData.type === 'Remote' ? 'Online' : formData.location,
          type: formData.type,
          requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
          imageUrl: thumbnailUrl,
          iconUrl: iconUrl || undefined,
          formLink: formData.formLink || undefined,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          timeCommitmentUnit: formData.timeCommitmentUnit,
        }),
        organization_id: user?.id, // Link to organization
      };

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from('opportunities')
        .insert([opportunityData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        setError('Failed to submit opportunity. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const isOrganization = user?.user_metadata?.account_type === 'organization';
    
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center text-center px-4 page-transition">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="material-symbols-outlined text-3xl text-green-600">check</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Opportunity Posted!</h1>
          <p className="text-gray-600 mb-6">Your opportunity is now live and visible to volunteers.</p>
          {isOrganization ? (
            <button
              onClick={() => navigate('/organization-dashboard')}
              className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Back to Dashboard
            </button>
          ) : (
            <Link to="/opportunities" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Browse Opportunities
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col overflow-x-hidden bg-background-light page-transition">
      <div className="flex-grow flex flex-col py-10 px-4 md:px-8">
        <div className="flex flex-1 justify-center">
          <div className="flex flex-col max-w-[800px] w-full">
            <div className="flex flex-col gap-3 mb-8 text-center md:text-left">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold tracking-tight">Partner with LaunchServe</h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">Help us empower the next generation of changemakers.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-10 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">apartment</span>Organization Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Organization Name</p>
                      <input required name="organization" value={formData.organization} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. Green Earth Initiative" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Contact Email</p>
                      <input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="name@organization.org" />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Phone Number <span className="text-slate-400 font-normal">(Optional)</span></p>
                      <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="(555) 123-4567" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Website <span className="text-slate-400 font-normal">(Optional)</span></p>
                      <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://yourorganization.org" />
                    </label>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">share</span>Social Media <span className="text-slate-400 font-normal text-sm">(Optional)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Facebook</p>
                      <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://facebook.com/yourpage" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Instagram</p>
                      <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://instagram.com/yourpage" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Twitter / X</p>
                      <input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://twitter.com/yourhandle" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">LinkedIn</p>
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://linkedin.com/company/yourorg" />
                    </label>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">image</span>Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Organization Icon <span className="text-slate-400 font-normal">(Optional)</span></p>
                      <input type="file" ref={iconInputRef} accept="image/*" onChange={(e) => handleImageChange(e, 'icon')} className="hidden" />
                      <div onClick={() => iconInputRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        {iconPreview ? (
                          <img src={iconPreview} alt="Icon preview" className="w-20 h-20 object-cover rounded-lg" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-3xl text-slate-400">add_photo_alternate</span>
                            <p className="text-sm text-slate-400 mt-2">Click to upload icon</p>
                            <p className="text-xs text-slate-300">Square image recommended</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Thumbnail Image <span className="text-slate-400 font-normal">(Optional)</span></p>
                      <input type="file" ref={thumbnailInputRef} accept="image/*" onChange={(e) => handleImageChange(e, 'thumbnail')} className="hidden" />
                      <div onClick={() => thumbnailInputRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        {thumbnailPreview ? (
                          <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-3xl text-slate-400">add_photo_alternate</span>
                            <p className="text-sm text-slate-400 mt-2">Click to upload thumbnail</p>
                            <p className="text-xs text-slate-300">600x400 recommended</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">volunteer_activism</span>The Opportunity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Opportunity Title</p>
                      <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. Weekend Park Cleanup" />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Application Form Link <span className="text-slate-400 font-normal">(Optional)</span></p>
                      <input type="url" name="formLink" value={formData.formLink} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="https://forms.gle/your-form" />
                    </label>
                  </div>
                  <label className="flex flex-col">
                    <p className="text-slate-700 text-sm font-semibold pb-2">Short Description</p>
                    <input required name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="A brief one-liner about the opportunity..." />
                  </label>
                  <div className="flex flex-col">
                    <p className="text-slate-700 text-sm font-semibold pb-2">Full Description</p>
                    <RichTextEditor content={formData.fullDescription} onChange={(html) => setFormData(prev => ({ ...prev, fullDescription: html }))} placeholder="Describe the role, responsibilities, and impact..." />
                  </div>
                  <label className="flex flex-col">
                    <p className="text-slate-700 text-sm font-semibold pb-2">Requirements</p>
                    <input name="requirements" value={formData.requirements} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. Basic computer skills, Good communication" />
                    <p className="text-xs text-slate-400 mt-1.5">Separate with commas</p>
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-700 text-sm font-semibold pb-2">Tags</p>
                    <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. Environment, Weekend, Community" />
                    <p className="text-xs text-slate-400 mt-1.5">Separate with commas</p>
                  </label>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">schedule</span>Location & Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Location Type</p>
                      <div className="flex bg-slate-100 p-1 rounded-xl h-12">
                        <label className="flex-1 relative cursor-pointer">
                          <input checked={formData.type === 'In-Person'} onChange={() => handleTypeChange('In-Person')} className="peer sr-only" name="locationType" type="radio" />
                          <div className="w-full h-full flex items-center justify-center rounded-lg text-sm font-medium text-slate-500 peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all gap-2">
                            <span className="material-symbols-outlined text-[18px]">group</span>In-Person
                          </div>
                        </label>
                        <label className="flex-1 relative cursor-pointer">
                          <input checked={formData.type === 'Remote'} onChange={() => handleTypeChange('Remote')} className="peer sr-only" name="locationType" type="radio" />
                          <div className="w-full h-full flex items-center justify-center rounded-lg text-sm font-medium text-slate-500 peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm transition-all gap-2">
                            <span className="material-symbols-outlined text-[18px]">laptop_chromebook</span>Remote
                          </div>
                        </label>
                      </div>
                    </div>
                    {formData.type === 'In-Person' && (
                      <label className="flex flex-col">
                        <p className="text-slate-700 text-sm font-semibold pb-2">Location Address</p>
                        <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. Oakland, CA" />
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Time Commitment</p>
                      <div className="flex items-center gap-3">
                        <input required name="timeCommitment" value={formData.timeCommitment} onChange={handleInputChange} className="w-24 rounded-xl border-slate-200 bg-slate-50 h-12 px-4" placeholder="e.g. 2-4" />
                        <select name="timeCommitmentUnit" value={formData.timeCommitmentUnit} onChange={handleInputChange} className="flex-1 rounded-xl border-slate-200 bg-slate-50 h-12 px-4">
                          <option value="hours/week">hours/week</option>
                          <option value="hours/month">hours/month</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-slate-700 text-sm font-semibold pb-2">Preferred Age Range</p>
                      <div className="flex items-center gap-4">
                        <input type="number" name="ageMin" value={formData.ageMin} onChange={handleInputChange} min={13} max={18} className="w-24 rounded-xl border-slate-200 bg-slate-50 h-12 px-4" />
                        <span className="text-slate-400 font-medium">to</span>
                        <input type="number" name="ageMax" value={formData.ageMax} onChange={handleInputChange} min={13} max={18} className="w-24 rounded-xl border-slate-200 bg-slate-50 h-12 px-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-3 max-w-sm">
                    <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5">verified_user</span>
                    <p className="text-xs text-slate-500 leading-relaxed">All listings are reviewed by our team before going live.</p>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full md:w-auto min-w-[200px] flex items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-primary-hover text-white text-base font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitOpportunityPage;
