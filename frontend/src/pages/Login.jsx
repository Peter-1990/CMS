import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext);

  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      
      if (state === 'Sign Up') {
        
        const {data} = await axios.post(backendUrl + '/api/user/register',{name,email,password})
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        
         const {data} = await axios.post(backendUrl + '/api/user/login',{email,password})
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    }
    
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  },[navigate, token])

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto mb-6"
            src={assets.logo}
            alt="Prescripto Logo"
            onError={(e) => {
              e.target.src = 'https://placehold.co/200x50/3b82f6/white?text=Prescripto';
            }}
          />
          <h2 className="text-3xl font-bold text-gray-900">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-gray-600">
            {state === "Sign Up" 
              ? "Sign up to book appointments with trusted doctors" 
              : "Log in to access your healthcare dashboard"
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {state === "Login" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                {state === "Sign Up" ? "Creating Account..." : "Logging in..."}
              </div>
            ) : (
              state === "Sign Up" ? "Create Account" : "Login"
            )}
          </button>

          {/* Demo Login Button */}
          {state === "Login" && (
            <button
              type="button"
              
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Try Demo Account
            </button>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/512120/google-177.svg" alt="Google" />
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/506498/facebook.svg" alt="Facebook" />
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          {/* Toggle between Login/Sign Up */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {state === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setState(state === "Sign Up" ? "Login" : "Sign Up");
                  setErrors({});
                }}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-300"
              >
                {state === "Sign Up" ? "Login here" : "Sign up here"}
              </button>
            </p>
          </div>
        </form>

        {/* Security Note */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Your data is securely encrypted and protected</p>
        </div>
      </div>
    </div>
  )
}

export default Login