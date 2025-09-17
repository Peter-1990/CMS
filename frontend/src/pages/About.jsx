import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: '500+', label: 'Expert Doctors', icon: '👨‍⚕️' },
    { number: '10K+', label: 'Happy Patients', icon: '😊' },
    { number: '24/7', label: 'Support', icon: '🔄' },
    { number: '99%', label: 'Satisfaction Rate', icon: '⭐' }
  ];

  const team = [
    { name: 'Dr. Sarah Chen', role: 'Chief Medical Officer', specialty: 'Cardiology', exp: '15+ years' },
    { name: 'Dr. Michael Rodriguez', role: 'Technical Director', specialty: 'Health Informatics', exp: '12+ years' },
    { name: 'Dr. Emily Thompson', role: 'Patient Care Director', specialty: 'Family Medicine', exp: '10+ years' },
    { name: 'Dr. James Wilson', role: 'Operations Manager', specialty: 'Healthcare Administration', exp: '8+ years' }
  ];

  const values = [
    { icon: '❤️', title: 'Patient First', description: 'Every decision we make is centered around patient well-being and comfort.' },
    { icon: '⚡', title: 'Innovation', description: 'Leveraging cutting-edge technology to revolutionize healthcare delivery.' },
    { icon: '🤝', title: 'Trust & Transparency', description: 'Building relationships based on honesty and open communication.' },
    { icon: '🌍', title: 'Accessibility', description: 'Making quality healthcare accessible to everyone, everywhere.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="absolute inset-0 bg-medical-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              About Prescripto
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare through innovative technology and compassionate care. 
              We're on a mission to make quality healthcare accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src={assets.about_image}
                  alt="Medical team"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400/1e40af/white?text=Medical+Team';
                  }}
                />
                <div className="absolute -bottom-6 -right-6 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                  Trusted Since 2020
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex gap-4 mb-6">
                  {['mission', 'story', 'vision'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="transition-all duration-500">
                  {activeTab === 'mission' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To provide seamless, accessible, and high-quality healthcare solutions through 
                        innovative technology. We believe everyone deserves exceptional medical care 
                        delivered with compassion and efficiency.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'story' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Founded in 2020 by a team of healthcare professionals and technologists, 
                        Prescripto was born from a simple idea: make healthcare appointments as 
                        easy as booking a ride. Today, we serve thousands of patients and hundreds 
                        of doctors across the country.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'vision' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To become the most trusted healthcare platform globally, transforming how 
                        people access and experience medical care. We envision a future where 
                        healthcare is personalized, preventive, and perfectly accessible.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Prescripto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate professionals driving our mission forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                  👨‍⚕️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-2">{member.specialty}</p>
                <p className="text-gray-500 text-xs">{member.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust Prescripto for their healthcare needs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/doctors')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;