import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi, quizQuestions } from '../services/api';
import useAuthStore from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Quiz from '../components/onboarding/Quiz';

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<(File | string)[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore(state => state.user);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (photos.length + files.length > 5) {
        setError('You can upload a maximum of 5 photos.');
        return;
      }
      setPhotos(prev => [...prev, ...files]);
    }
  };
  
  const handleAddInterest = () => {
      if(interestInput && !interests.includes(interestInput) && interests.length < 5){
          setInterests(prev => [...prev, interestInput]);
          setInterestInput('');
      }
  }

  const validateStep1 = () => name && age && location && bio;
  const validateStep2 = () => photos.length > 0 && interests.length > 0;
  const validateStep3 = () => Object.keys(quizAnswers).length === quizQuestions.length;

  const nextStep = () => {
      setError('');
      if (step === 1 && !validateStep1()) {
          setError('Please fill out all fields.');
          return;
      }
      if (step === 2 && !validateStep2()) {
          setError('Please add at least one photo and one interest.');
          return;
      }
      setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) {
        setError('Please answer all quiz questions.');
        return;
    }
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await mockApi.updateProfile(user.id, {
        name,
        age: Number(age),
        bio,
        location,
        photos,
        interests,
        quizAnswers,
      });
      await checkAuth();
      navigate('/discover');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      // If photo fails, stay on step 2
      if (err.message.toLowerCase().includes('photo')) {
          setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
            <div className="space-y-4">
                <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))} required />
                <Input label="Location (e.g., City, State)" value={location} onChange={e => setLocation(e.target.value)} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} required maxLength={200} className="w-full px-4 py-3 rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary border-gray-300" rows={3} placeholder="Tell us a little about yourself..."></textarea>
                </div>
            </div>
        );
      case 2:
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interests (up to 5)</label>
                    <div className="flex gap-2">
                        <Input value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="e.g. Hiking" />
                        <Button type="button" variant="secondary" onClick={handleAddInterest} className="w-auto px-4 !py-2">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {interests.map(interest => (
                            <span key={interest} className="bg-primary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full">{interest}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photos (up to 5)</label>
                     <p className="text-xs text-gray-500 mb-2">Your first photo is your main profile picture. All photos will be checked by our AI for safety.</p>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt={`upload-${index}`} className="w-full h-full object-cover"/>
                            </div>
                        ))}
                        {photos.length < 5 && (
                            <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                +
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        );
      case 3:
        return <Quiz answers={quizAnswers} setAnswers={setQuizAnswers} />;
      default:
        return null;
    }
  }

  return (
    <div className="p-4 pt-8">
      <h1 className="text-3xl font-bold text-center mb-2">Create Your Profile</h1>
      <p className="text-text-secondary text-center mb-6">
          Step {step} of 3: {step === 1 ? 'About You' : step === 2 ? 'Your Vibe' : 'Personality Quiz'}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderStep()}
        {error && <p className="text-center text-red-500 pt-2">{error}</p>}
        <div className="flex gap-4 pt-4">
            {step > 1 && <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>}
            {step < 3 ? (
                <Button type="button" onClick={nextStep}>Next</Button>
            ) : (
                <Button type="submit" isLoading={loading}>Complete Profile</Button>
            )}
        </div>
      </form>
    </div>
  );
};

export default OnboardingPage;