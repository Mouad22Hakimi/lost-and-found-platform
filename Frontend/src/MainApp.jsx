import React, { useState } from 'react';
import { Search, Plus, MapPin, Calendar, Tag, User, CheckCircle, Bell, Menu, X, LogOut } from 'lucide-react';


// state management
const MainApp = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Keys', 'IDs', 'Bags', 'Other'];
  
  const sampleItems = [
    {
      id: 1,
      type: 'found',
      title: 'iPhone 13 Pro',
      category: 'Electronics',
      location: 'Library Building - 2nd Floor',
      date: '2024-11-01',
      description: 'Black iPhone with cracked screen protector',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1592286927505-2fd0f2875986?w=400'
    },
    {
      id: 2,
      type: 'lost',
      title: 'Blue Backpack',
      category: 'Bags',
      location: 'Student Center',
      date: '2024-10-30',
      description: 'Nike backpack with laptop inside',
      status: 'searching',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
    },
    {
      id: 3,
      type: 'found',
      title: 'Student ID Card',
      category: 'IDs',
      location: 'Engineering Building',
      date: '2024-11-02',
      description: 'ID belonging to Alex Johnson',
      status: 'claimed',
      image: null
    },
    {
      id: 4,
      type: 'found',
      title: 'AirPods Pro',
      category: 'Electronics',
      location: 'Cafeteria',
      date: '2024-10-29',
      description: 'White case with name Sam written on it',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'
    },
    {
      id: 5,
      type: 'lost',
      title: 'Dorm Keys',
      category: 'Keys',
      location: 'Gym',
      date: '2024-11-01',
      description: 'Keychain with red lanyard and room 304 tag',
      status: 'searching',
      image: null
    },
    {
      id: 6,
      type: 'found',
      title: 'Calculus Textbook',
      category: 'Books',
      location: 'Mathematics Department',
      date: '2024-10-28',
      description: 'Stewart Calculus 8th Edition with notes',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
    }
  ];

  // stores the list of all items displayed
  const [items, setItems] = useState(sampleItems);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    date: '',
    description: ''
  });

//Filters items based on the user’s search text.
//Filters items based on the selected category.
//Returns only items that match both conditions.

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  //submit new report
  const handleSubmitReport = () => {
    if (!formData.title || !formData.location || !formData.date || !formData.description) {
      alert('Please fill in all fields');
      return;
    }
    
    const newItem = {
      id: items.length + 1,
      type: reportType,
      title: formData.title,
      category: formData.category,
      location: formData.location,
      date: formData.date,
      description: formData.description,
      status: reportType === 'found' ? 'available' : 'searching',
      image: null
    };
    setItems([newItem, ...items]);
    setShowReportModal(false);
    setFormData({ title: '', category: 'Electronics', location: '', date: '', description: '' });
  };
// header section : navigation bar with logo, user info, notifications, 
// report button, and logout
  return (

  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    // ===================== HEADER =====================
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center py-4">

          // Logo + App title
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Lost & Found
              </h1>
              <p className="text-xs text-gray-500">Campus Recovery Platform</p>
            </div>
          </div>

          // Desktop user info + actions
          <div className="hidden md:flex items-center space-x-4">

            // Show logged-in user name
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentUser?.fullName}</span>
            </div>

            // Notification button (UI only)
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            // Report item button
            <button
              onClick={() => {
                setShowReportModal(true);
                setReportType('lost');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Report Item</span>
            </button>

            // Logout button
            <button
              onClick={onLogout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          // Mobile menu toggle (hamburger)
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        // Mobile menu content
        {showMobileMenu && (
          <div className="md:hidden pb-4 space-y-2">

            // Mobile user info
            <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentUser?.fullName}</span>
            </div>

            // Notifications button
            <button className="w-full flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span>Notifications</span>
            </button>

            // Report item (mobile)
            <button
              onClick={() => {
                setShowReportModal(true);
                setReportType('lost');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Report Item</span>
            </button>

            // Logout (mobile)
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 p-3 hover:bg-red-50 text-red-600 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>

    // ===================== MAIN CONTENT =====================
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      // Search + filter section
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          // Search bar
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for lost or found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          // Category dropdown
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        // Tabs (All / Found / Lost)
        <div className="flex gap-2 mt-6 border-b border-gray-200">

          // Browse All tab
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-medium border-b-2 ${
              activeTab === 'browse'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Browse All
          </button>

          // Found tab
          <button
            onClick={() => setActiveTab('found')}
            className={`px-6 py-3 font-medium border-b-2 ${
              activeTab === 'found'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Found Items
          </button>

          // Lost tab
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-6 py-3 font-medium border-b-2 ${
              activeTab === 'lost'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Lost Items
          </button>

        </div>
      </div>

      // ===================== ITEMS GRID =====================
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredItems
          .filter(item => activeTab === 'browse' || item.type === activeTab) // filter based on tab
          .map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden group">

              // Item image
              {item.image ? (
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                // Placeholder if no image
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Tag className="w-16 h-16 text-gray-400" />
                </div>
              )}

              // Item content
              <div className="p-5">

                // Title + status badge
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.type === 'found'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type === 'found' ? 'Found' : 'Lost'}
                  </span>
                </div>

                // Category / Location / Date
                <div className="space-y-2 text-sm text-gray-600 mb-4">

                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span>{item.category}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{item.location}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>

                // Item status + CTA button
                <div className="flex items-center justify-between">

                  // Status text
                  <span className={`flex items-center space-x-1 text-xs font-medium ${
                    item.status === 'claimed'
                      ? 'text-gray-500'
                      : item.status === 'available'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    {item.status === 'claimed' ? (
                      <><CheckCircle className="w-4 h-4" /> <span>Claimed</span></>
                    ) : item.status === 'available' ? (
                      <><CheckCircle className="w-4 h-4" /> <span>Available</span></>
                    ) : (
                      <><Search className="w-4 h-4" /> <span>Searching</span></>
                    )}
                  </span>

                  // Action button
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    {item.type === 'found' ? 'Claim Item' : 'Contact'}
                  </button>
                </div>

              </div>
            </div>
          ))}
      </div>

      // Show a message when no results
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </main>

    // ===================== REPORT ITEM MODAL =====================
    {showReportModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

        // Modal container
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

          // Modal title + close button
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Report an Item</h2>
            <button
              onClick={() => setShowReportModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          // Modal body
          <div className="p-6 space-y-6">

            // Lost / Found toggle buttons
            <div className="flex gap-4">
              <button
                onClick={() => setReportType('lost')}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  reportType === 'lost' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                I Lost Something
              </button>

              <button
                onClick={() => setReportType('found')}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  reportType === 'found' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                I Found Something
              </button>
            </div>

            // Item name input
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., iPhone 13 Pro, Blue Backpack"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            // Category + Date
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              // Category dropdown
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              // Date input
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            // Location input
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Library Building - 2nd Floor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            // Description textarea
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                placeholder="Provide any additional details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              />
            </div>

            // Modal action buttons
            <div className="flex gap-4">

              // Cancel button
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>

              // Submit button
              <button
                onClick={handleSubmitReport}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
              >
                Submit Report
              </button>

            </div>

          </div>

        </div>
      </div>
    )}

  </div>
);
