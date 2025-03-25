// Dashboard.jsx
import React, { useState } from 'react';
import { useDashboard } from '../feature/dashboard/useDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, isLoading, refetch } = useDashboard(currentPage);
  const [filter, setFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date()); // For calendar navigation
  const navigate = useNavigate();

  // Helper function to get date part from scheduled_time
  const getDateString = (scheduledTime) => {
    return scheduledTime ? scheduledTime.split('T')[0] : '';
  };

  // Generate calendar for the current month
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { year, month, daysInMonth, firstDay };
  };

  const { year, month, daysInMonth, firstDay } = getMonthData();

  const getPostsForDate = (day) => {
    if (!posts || !posts.data) return [];
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return posts.data.filter(post => getDateString(post.scheduled_time) === dateStr) || [];
  };

  // Filter posts
  const filteredPosts = posts && posts.data 
    ? (filter === 'all' 
        ? posts.data 
        : posts.data.filter(post => post.status === filter))
    : [];

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!posts) return <div className="text-center py-10 text-red-500">No data available</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className='flex justify-between py-3'>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <button className='px-2 w-30 py-1 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-800'
          onClick={() => navigate('/post')}
          >
             Create Post
          </button>
        </div>

        {/* Calendar View */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Scheduled Posts Calendar
            </h2>
            <div className="space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-lg font-medium">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={goToNextMonth}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="h-24"></div>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayPosts = getPostsForDate(day);
                return (
                  <div
                    key={day}
                    className="h-24 border rounded-md p-2 hover:bg-gray-50 cursor-pointer relative"
                  >
                    <span className="text-sm text-gray-600">{day}</span>
                    {dayPosts.map(post => (
                      <div
                        key={post.id}
                        className={`text-xs mt-1 p-1 rounded ${
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {post.title} ({post.platforms.map(p => p.name).join(', ')})
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* List View with Filters */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts List</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === 'scheduled' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === 'draft' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === 'published' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Published
              </button>
            </div>

            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{post.content}</p>
                    <p className="text-sm text-gray-500">
                      Scheduled: {new Date(post.scheduled_time).toLocaleString()} • 
                      Platforms: {post.platforms.map(p => p.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt="Post preview" 
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
              {filteredPosts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No posts found</p>
              )}
            </div>

            {/* Pagination */}
            {posts.last_page > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                {posts.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url) {
                        const urlParams = new URLSearchParams(link.url.split('?')[1]);
                        const newPage = urlParams.get('page');
                        setCurrentPage(parseInt(newPage));
                        refetch();
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      link.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={!link.url}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;