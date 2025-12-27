
'use client';

import { useState, useEffect } from 'react';

export default function ZipCodePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedZip = localStorage.getItem('user_zip');
    if (!storedZip) {
      setIsOpen(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit zip code.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error('Invalid Zip Code');
      const data = await res.json();

      const lat = parseFloat(data.places[0].latitude);
      const lng = parseFloat(data.places[0].longitude);

      localStorage.setItem('user_zip', zip);
      localStorage.setItem('user_location', JSON.stringify({ lat, lng }));

      setIsOpen(false);
      // Optional: Emit event or reload to ensure other components pick it up immediately if they are already mounted
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError('Could not find location for this zip code.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#222] p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
        <p className="text-gray-400 mb-6">Enter your Zip Code to see how far you are from each team.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip Code (e.g. 90210)"
            className="p-3 rounded bg-[#222] border border-gray-600 text-white text-center text-lg focus:border-blue-500 outline-none"
            maxLength={5}
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Locating...' : 'Start'}
          </button>
        </form>
      </div>
    </div>
  );
}
