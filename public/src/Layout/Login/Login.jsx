import { useState } from 'react';
import Logo from '../../Components/Logo/Logo';
import { motion, MotionConfig } from 'framer-motion';
import './index.css';
import LoginSignNavBar from '../../Components/LoginSignNavBar/LoginSignNavBar';

const Login = () => {
  const [User, setUser] = useState(['Brand', 'SignUpBrandPage1']);
  const [IsSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFormErrors('Passwords do not match.');
      return;
    }
    // Handle successful sign up (e.g., save data and redirect)
    setFormErrors('');
    // Redirect or perform next steps here
    setIsSignUp(false); // Assuming you want to go back to login after successful sign-up
  };

  return (
    <div className='w-screen h-screen flex text-10px'>
      <motion.div
        layoutId='Logo'
        className='absolute top-1 z-20'>
        <Logo />
      </motion.div>
      {/* Left hand Side */}
      {!IsSignUp && (
        <div className='w-8/12 border-2 border-green-300 flex flex-col justify-center'>
          <p className='text-center poppins-semibold'>Login</p>
          <div className="w-full">
            <div className="p-4">
              <LoginSignNavBar User={User} setUser={setUser} />
              <div className='w-8/12 mx-auto'>
                <div className='my-2'>
                  <p className='poppins-light'>Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='inputField rounded-md'
                  />
                </div>
                <div className='my-2'>
                  <p className='poppins-light'>Password</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='inputField rounded-md'
                  />
                </div>
                <p className='poppins-extralight'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                <button className='Button rounded-md'>Login</button>
                <p className='poppins-light my-1'>
                  Create an account? <a onClick={() => setIsSignUp(true)} href='#' className='underline'>Sign Up</a>
                </p>
                <a href='#' className='poppins-light underline'>Forget Password</a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Right hand Side */}
      <motion.div
        layout
        className={`${!IsSignUp ? 'backgroundPicture' : 'bgSignUp'} w-6/12 flex flex-col justify-center relative`}>
        <MotionConfig transition={{ duration: 0.5 }}>
          <div className="flex w-full h-full items-center absolute top-0">
            <img className="" src="L2.jpg" alt="" />
          </div>
        </MotionConfig>
      </motion.div>
      {/* Sign Up form */}
      {IsSignUp && (
        <motion.div layoutId='1' className='bg-white w-7/12'>
          <div className='flex flex-col justify-center'>
            <p className='text-center text-2xl poppins-semibold mt-4'>Sign Up</p>
            <div className="w-full">
              <div className="p-4">
                <div className='w-8/12 mx-auto'>
                  <LoginSignNavBar User={User} setUser={setUser} />
                  <div className='my-2'>
                    <p className='poppins-light'>Email</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='inputField rounded-md'
                    />
                  </div>
                  <div className='my-2'>
                    <p className='poppins-light'>Password</p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='inputField rounded-md'
                    />
                  </div>
                  <div className='my-2'>
                    <p className='poppins-light'>Confirm Password</p>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='inputField rounded-md'
                    />
                  </div>
                  {formErrors && <p className='text-red-500'>{formErrors}</p>}
                  <p className='text-sm poppins-extralight'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                  <button className='Button h-11 rounded-md px-8 my-2' onClick={handleSignUp}>Sign Up</button>
                  <p className='poppins-light text-sm my-1'>
                    Already have an account? <a href='#' onClick={() => setIsSignUp(false)} className='underline'>Login</a>
                  </p>
                  <a href='#' className='poppins-light text-sm underline'>Forget Password</a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;