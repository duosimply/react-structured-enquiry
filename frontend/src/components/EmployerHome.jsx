import React, { useState, useEffect } from 'react';
import useAuthStore from '../utils/useAuthStore';

const EmployerHome = () => {
    const { token, role, company } = useAuthStore();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (role !== 'employer') {
      setMessage('Access denied. You are not authorized to view this page.');
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/employer/applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Company': company,  // Send the employer's company in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
          console.log(data); // Log the fetched data for debugging
        } else {
          setMessage('No applications found.');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setMessage('Failed to fetch applications.');
      }
    };

    fetchApplications();
  }, [token, role, company]);

  return (
    <div className="p-8 max-w-7xl mx-auto mt-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Employer Applications</h2>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      {applications.length > 0 && (
        <div>
          <ul>
            {applications.map((application) => (
              <li key={application.id} className="border p-4 rounded-lg shadow-md mb-4">
                <p><strong>Job Title:</strong> {application.title}</p>
                <p><strong>Location:</strong> {application.location}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployerHome;
