import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import Logo from '../../Components/Logo/Logo';
import { motion } from 'framer-motion';
import './index.css';
import LoginSignNavBar from '../../Components/LoginSignNavBar/LoginSignNavBar';
import Cookies from 'js-cookie';

const Login2 = () => {
  const [User, setUser] = useState(['Brand', 'Brand']);
  const [Page, setPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPassword = (password) => {
    const re = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setFormErrors('Invalid email format.');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType: User[1] }), 
      });
  
      const data = await response.json(); // Response contains both result and token
      console.log("Result is ", data);
  
      if (response.ok) {
        const { result, token } = data;  // Destructure result and token from the response
        const userType = result.userType;  // Extract userType from result object
  
        console.log("UserType: ", userType);  // Log userType for verification
  
        // Set the cookie based on userType
        switch (userType) {
          case 'Brand':
            await setCookie('yourCookieName', 'b', { expires: 7 });
            break;
          case 'influencer':
            await setCookie('yourCookieName', 'i', { expires: 7 });
            break;
          case 'User':
            await setCookie('yourCookieName', 'u', { expires: 7 });
            break;
          default:
            console.log('Unknown userType');
        }
  
        // Store the token in localStorage
        if (localStorage.getItem('authToken')) {
          localStorage.removeItem('authToken');
        }
        localStorage.setItem('authToken', token);
  
        // Redirect to homepage
        navigate('/');
      } else {
        setFormErrors(data.message);  // Show error message
      }
    } catch (error) {
      console.error('Login failed:', error);
      setFormErrors('Login failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };   

  const setCookie = (name, value, options) => {
    return new Promise((resolve) => {
      Cookies.set(name, value, options);
      resolve();
    });
  };

  const handleSignUp = async () => {
    if (!isValidEmail(email)) {
      setFormErrors('Invalid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      setFormErrors('Password must be at least 8 characters long, including letters, numbers, and symbols.');
      return;
    }

    if (password !== confirmPassword) {
      setFormErrors('Passwords do not match.');
      return;
    }

    setFormErrors('');

    setIsLoading(true);
    try {
      const response = await fetch(`/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType: User[1] }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Signed Up successfully:", result.token);
        if(localStorage.getItem('authToken')) localStorage.removeItem('authToken');
        localStorage.setItem('authToken', result.token);
        navigate(`/SignUp/${User[1]}`, { state: { userId: result.userId, from: location.pathname } });
      } else {
        setFormErrors(result.message);
      }
    } catch (error) {
      console.error('Sign-up failed:', error);
      setFormErrors('Sign-up failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = () => {
    if (Page) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className='h-screen items-center sm:h-[550px] lg:h-screen flex text-10px bgSignUp text-[12px]'>
      {/* Left hand Side */}
      {/* Middle Container */}
      <div className="w-8/12 mx-auto BarColor my-10 h-[350px] xs:h-[400px] sm:h-[500px] rounded-3xl overflow-hidden relative">
        <div className="flex justify-between items-center mx-10 pt-2">
          <div className="">
            <img className="bg-transparent w-8 sm:w-12 lg:w-20" src="/Logo/Logo.jpg" alt="" />
          </div>
          <img className="w-[240px]" src="/Logo/LogoText.jpg" alt="" />
          <h1 className="hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black py-[4px] text-[7px] sm:text-[10px] px-2">Home</h1>
        </div>
        <div className='flex items-center'>
          {Page ? (
            <img className="hidden md:flex w-96 absolute bottom-0 -right-[100px] z-20" src="/Images/undraw_influencer.svg" alt="" />
          ) : (
            <img className="hidden lg:block w-[600px] absolute -left-[160px] bottom-0 z-20" src="/Images/undraw_2.svg" alt="" />
          )}
          <motion.img
            layout
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={`absolute hidden md:block -bottom-28 z-20 ${Page ? "-left-[250px] lg:-left-[200px]" : "-right-[250px] -z-10"}`}
            src="/Images/Mask_Group.png"
            alt=""
          />
          <div className={`w-full flex ${Page ? "justify-center" : "justify-center sm:justify-end"}`}>
            <div className="w-[500px]">
              <p className='text-center poppins-semibold mt-1 text-[12px] sm:text-xl'>{Page ? 'Login' : 'Sign Up'}</p>
              <div className="w-full">
                <div className="sm:p-4">
                  <LoginSignNavBar User={User} setUser={setUser} />
                  <div className='w-8/12 mx-auto'>
                    <div className='my-2'>
                      <p className='poppins-light text-[9px] sm:text-[12px]'>Email</p>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='inputField rounded-md'
                        id='email'
                      />
                    </div>
                    <div className='my-2'>
                      <p className='poppins-light text-[8px] sm:text-[12px]'>Password</p>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='inputField rounded-md'
                        id='password'
                      />
                    </div>
                    {!Page && (
                      <div className='my-2'>
                        <p className='poppins-light text-[8px] sm:text-[12px]'>Confirm Password</p>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className='inputField rounded-md'
                          id='confirmPassword'
                        />
                      </div>
                    )}
                    {formErrors && <p className='text-red-500'>{formErrors}</p>}
                    <p className='poppins-extralight text-[8px] sm:text-[12px]'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                    <button
                      onClick={handleNavigation}
                      className='Button poppins-regular rounded-md py-[5px] md:py-[6px] text-[12px] px-5 cursor-pointer'
                      disabled={isLoading}  // Disable button when loading
                    >
                      {isLoading ? "Processing..." : (Page ? "Login" : "Sign Up")}
                    </button>
                    <p className='poppins-light mt-1 sm:my-1 text-[8px] sm:text-[12px]'>
                      {Page ? "Create an account?" : "Already have an account?"} 
                      <a
                        className='underline cursor-pointer text-[8px] sm:text-[12px]'
                        onClick={() => setPage((prev) => !prev)}
                      >
                        {Page ? "Sign Up" : "Login"}
                      </a>
                    </p>
                    {Page && (
                      <a href='#' className='poppins-light underline cursor-pointer text-[8px] sm:text-[12px]'>Forget Password</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login2;