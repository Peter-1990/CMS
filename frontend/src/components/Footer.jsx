import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
      <div className='bg-blue-900 text-white py-12 px-4 md:px-8'>
          <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
              
              {/*------left section----- */}
              <div className='text-center md:text-left'>
                  <img className='w-32 mx-auto md:mx-0 mb-4' src={assets.logo} alt="Prescripto Logo" />
                  <p className='text-gray-300 text-sm'>Prescripto is a comprehensive clinic management system designed to streamline healthcare operations. Manage patient records, appointments, billing, and medical history efficiently and securely.</p>
              </div>

              {/*----center section------ */}
              <div className='text-center md:text-left'>
                  <p className='font-bold text-lg mb-4 text-blue-200'>COMPANY</p>
                  <ul className='space-y-2'>
                      <li className='cursor-pointer hover:text-blue-300 transition-colors'>Home</li>
                      <li className='cursor-pointer hover:text-blue-300 transition-colors'>About Us</li>
                      <li className='cursor-pointer hover:text-blue-300 transition-colors'>Contact Us</li>
                      <li className='cursor-pointer hover:text-blue-300 transition-colors'>Privacy Policy</li>
                  </ul>
              </div>

              {/*----right section------ */}
              <div className='text-center md:text-left'>
                  <p className='font-bold text-lg mb-4 text-blue-200'>GET IN TOUCH</p>
                  <ul className='space-y-2'>
                      <li className='flex items-center justify-center md:justify-start gap-2'>
                          <span>📞</span> +1 212-456-7890
                      </li>
                      <li className='flex items-center justify-center md:justify-start gap-2'>
                          <span>✉️</span> contact@prescripto.com
                      </li>
                      <li className='flex items-center justify-center md:justify-start gap-2 text-sm text-gray-300'>
                          <span>🏥</span> 123 Healthcare Ave, Medical District
                      </li>
                  </ul>
              </div>

          </div>

          {/*----copyright section----- */}
          <div className='max-w-6xl mx-auto mt-8'>
              <hr className='border-blue-700 mb-6' />
              <p className='text-center text-gray-300 text-sm'>Copyright 2025@ Prescripto - All Rights Reserved | HIPAA Compliant</p>
          </div>
    </div>
  )
}

export default Footer