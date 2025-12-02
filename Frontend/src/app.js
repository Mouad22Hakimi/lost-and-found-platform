import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Calendar, Tag, User, CheckCircle, Bell, Menu, X, Lock, Mail, Eye, EyeOff, LogOut } from 'lucide-react';
import { authAPI, itemsAPI } from './api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);
  
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('browse');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Keys', 'IDs', 'Bags', 'Other'];
  
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          if (userData && !userData.message) {
            setCurrentUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated]);

  const loadItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const data = await authAPI.login(authForm.email, authForm.password);
      
      if (data.message) {
        alert(data.message);
        return;
      }

      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setAuthForm({ email: '', password: '', confirmPassword: '', fullName: '', studentId: '' });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async () => {
    if (!authForm.email || !authForm.password || !authForm.confirmPassword || !authForm.fullName || !authForm.studentId) {
      alert('Please fill in all fields');
      return;
    }
    
    if (authForm.password !== authForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (authForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const data = await authAPI.register(
        authForm.fullName,
        authForm.email,
        authForm.password,
        authForm.studentId
      );

      if (data.message) {
        alert(data.message);
        return;
      }

      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setAuthForm({ email: '', password: '', confirmPassword: '', fullName: '', studentId: '' });
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!authForm.email) {
      alert('Please enter your email address');
      return;
    }

    try {
      const data = await authAPI.forgotPassword(authForm.email);
      alert(data.message || 'Password reset link sent to your email');
      setAuthView('login');
      setAuthForm({ email: '', password: '', confirmPassword: '', fullName: '', studentId: '' });
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('Failed to send reset link. Please try again.');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setItems([]);
    setAuthForm({ email: '', password: '', confirmPassword: '', fullName: '', studentId: '' });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitReport = async () => {
    if (!formData.title || !formData.location || !formData.date || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newItem = await itemsAPI.create({
        title: formData.title,
        type: reportType,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        description: formData.description
      });

      if (newItem && !newItem.message) {
        await loadItems();
        setShowReportModal(false);
        setFormData({ title: '', category: 'Electronics', location: '', date: '', description: '' });
        alert('Item reported successfully!');
      } else {
        alert(newItem.message || 'Failed to report item');
      }
    } catch (error) {
      console.error('Submit report error:', error);
      alert('Failed to report item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Lost & Found</h1>
            <p className="text-blue-100">Campus Recovery Platform</p>
          </div>

          {authView === 'login' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="your.email@campus.edu"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    onClick={() => setAuthView('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Sign In
                </button>

                <div className="text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <button
                    onClick={() => setAuthView('signup')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}

          {authView === 'signup' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={authForm.fullName}
                      onChange={(e) => setAuthForm({...authForm, fullName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={authForm.studentId}
                      onChange={(e) => setAuthForm({...authForm, studentId: e.target.value})}
                      placeholder="STU12345"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="your.email@campus.edu"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={authForm.confirmPassword}
                      onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Create Account
                </button>

                <div className="text-center">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    onClick={() => setAuthView('login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {authView === 'forgot' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-gray-600 mb-6">Enter your email and we will send you a reset link</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      placeholder="your.email@campus.edu"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleForgotPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Send Reset Link
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setAuthView('login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentUser?.fullName}</span>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
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
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMobileMenu && (
            <div className="md:hidden pb-4 space-y-2">
              <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentUser?.fullName}</span>
              </div>
              <button className="w-full flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span>Notifications</span>
              </button>
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
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-3 hover:bg-red-50 text-red-600 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for lost or found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'browse'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse All
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'found'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Found Items
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'lost'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lost Items
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems
            .filter(item => activeTab === 'browse' || item.type === activeTab)
            .map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                {item.image ? (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Tag className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="p-5">
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
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
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
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      {item.type === 'found' ? 'Claim Item' : 'Contact'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {showReportModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Report an Item</h2>
          <button
            onClick={() => setShowReportModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setReportType('lost')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                reportType === 'lost'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              I Lost Something
            </button>
            <button
              onClick={() => setReportType('found')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                reportType === 'found'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              I Found Something
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., iPhone 13 Pro, Blue Backpack"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Library Building - 2nd Floor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              placeholder="Provide any additional details that might help identify the item..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowReportModal(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReport}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
      </main>
    </div>
  );
};

export default App;
