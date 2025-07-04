"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // Form state
  const [locationName, setLocationName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [country, setCountry] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zip, setZip] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+63");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [caNumber, setCaNumber] = useState("");
  const [reservable, setReservable] = useState(true);
  const [dsm, setDsm] = useState(false);

  // Autofill state
  const [suggestions, setSuggestions] = useState([]); // holds objects with name, addressLine1, etc.
  const [debouncedAddress, setDebouncedAddress] = useState("");

  // Debounce address1 input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedAddress(address1), 500);
    return () => clearTimeout(handler);
  }, [address1]);

  // Fetch suggestions when debouncedAddress changes
  useEffect(() => {
    if (!debouncedAddress) {
      setSuggestions([]);
      return;
    }
    fetch(
      `https://elocity-locationsearch-ry8jf.ondigitalocean.app/search?key=${encodeURIComponent(
        debouncedAddress
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        // data might be an array or { suggestions: [...] }
        const items = Array.isArray(data) ? data : data.suggestions || [];
        setSuggestions(items);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSuggestions([]);
      });
  }, [debouncedAddress]);

  // When a suggestion is clicked, fill the relevant fields
  const pickSuggestion = (item) => {
    setAddress1(item.addressLine1 || "");
    setAddress2(item.addressLine2 || "");
    setCountry(item.country || "");
    setStateProv(item.state || "");
    setCity(item.city || "");
    setZip(item.postalCode || "");
    setSuggestions([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Tabs */}
      <nav className="flex space-x-3">
        <button className="px-4 py-1 bg-green-500 text-white rounded-full">
          Location Management
        </button>
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full">
          Station Management
        </button>
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full">Asset Settings</button>
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full">
          Firmware Management
        </button>
      </nav>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-white border border-gray-300 rounded">
        <div className="absolute top-2 left-2 flex flex-col bg-white p-1 rounded shadow">
          <button className="w-6 h-6 flex items-center justify-center text-gray-800">+</button>
          <button className="w-6 h-6 flex items-center justify-center text-gray-800 mt-1">−</button>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="grid grid-cols-7 gap-4">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-medium">Location Name*</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Timezone*</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select timezone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Latitude*</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude*</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Country*</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select country</option>
              {country && <option value={country}>{country}</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">State/Province*</label>
            <select
              value={stateProv}
              onChange={(e) => setStateProv(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select state/province</option>
              {stateProv && <option value={stateProv}>{stateProv}</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">City*</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select city</option>
              {city && <option value={city}>{city}</option>}
            </select>
          </div>

          {/* Row 2 with address-autofill */}
          <div className="relative col-span-2">
            <label className="block text-sm font-medium">Address Line 1*</label>
            <input
              id="address1"
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-auto rounded">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => pickSuggestion(item)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Address Line 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Zip/Postal Code*</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400">Business Owner</label>
            <input
              type="text"
              value="Movem"
              disabled
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-2
              py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact Email*</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex space-x-2 col-span-3">
            <div>
              <label className="block text-sm font-medium">Contact Number</label>
              <div className="flex">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="mt-1 border border-gray-300 rounded-l px-2 py-1"
                >
                  <option>+63</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-r px-2 py-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Payment Type*</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select payment type</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">GST IN</label>
              <input
                type="text"
                value={gstIn}
                onChange={(e) => setGstIn(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium">CA Number</label>
            <input
              type="text"
              value={caNumber}
              onChange={(e) => setCaNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Toggles & Actions */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              id="reservable"
              type="checkbox"
              checked={reservable}
              onChange={() => setReservable((v) => !v)}
              className="h-5 w-5 text-green-500 border-gray-300 rounded"
            />
            <label htmlFor="reservable" className="ml-2 text-sm">
              Reservable
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="dsm"
              type="checkbox"
              checked={dsm}
              onChange={() => setDsm((v) => !v)}
              className="h-5 w-5 text-green-500 border-gray-300 rounded"
            />
            <label htmlFor="dsm" className="ml-2 text-sm">
              DSM
            </label>
          </div>
          <div className="ml-auto space-x-2">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded">
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
