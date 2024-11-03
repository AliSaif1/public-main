import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import './index.css';
import NavBar from './NavBar';

const UserSignUp = () => {
  const [stepperIndex, setStepperIndex] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    age: '',
    photo: null,
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userIdFromCookie = Cookies.get('userId');
    const userIdFromState = location.state?.userId;
    setFormData((prevData) => ({
      ...prevData,
      userId: userIdFromCookie || userIdFromState || '',
    }));
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTermsAccept = (accepted) => {
    setTermsAccepted(accepted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userId, fullName, age, photo, gender } = formData;
    if (!userId || !fullName || !age || !photo || !gender) {
      alert('Please fill in all fields.');
      return;
    }

    if (!termsAccepted && stepperIndex === 1) {
      alert('Please accept the terms and conditions.');
      return;
    }

    const data = new FormData();
    data.append('userId', userId);
    data.append('fullName', fullName);
    data.append('age', age);
    if (photo) {
      data.append('photo', photo);
    }
    data.append('gender', gender);

    if (stepperIndex === 1) {
      setLoading(true);
      try {
        await axios.post('/api/influencerInfo', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setStepperIndex(stepperIndex + 1);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setStepperIndex(stepperIndex + 1); // Move to next step
    }
  };

  return (
    <div className='w-full h-screen items-center sm:h-[550px] lg:h-screen flex text-10px bgSignUp text-[12px]'>

      {/* Middle Container */}
      <div className={`${stepperIndex < 3 ? "w-10/12" : 'w-11/12'} mx-auto BarColor my-10 h-[350px] xs:h-[400px] sm:h-[520px] rounded-3xl overflow-hidden relative`}>

        <div className="flex flex-col mx-10 pt-2">

          <div className="flex justify-between mx-10 items-center">
            <img className="bg-transparent w-8 sm:w-12 lg:w-56" src="/Logo/LogoText.jpg" alt="Logo" />
            <h1 className="BlackButtonWithText-v1 hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black h-[34px] items-center text-[7px] sm:text-[10px] px-4">Home</h1>
          </div>
          <div className="w-[700px] mt-10 mx-auto flex justify-between items-center">
            {stepperIndex > 0 && stepperIndex < 2 && (
              <img
                className="cursor-pointer"
                onClick={() => setStepperIndex(stepperIndex - 1)}
                src="/Svg/BackButton.svg"
                alt="Back"
              />
            )}
            <div className="flex-grow">
              {stepperIndex < 2 && (
                <NavBar
                  stepperIndex={stepperIndex}
                  nextStep={() => setStepperIndex(stepperIndex + 1)}
                  prevStep={() => setStepperIndex(stepperIndex - 1)}
                  setStepperIndex={setStepperIndex}
                  check={false}
                />
              )}
            </div>
          </div>

          <img
            className="absolute hidden md:block -bottom-28 z-20 -right-[150px] -bottom-2 -z-10"
            src="/Images/Mask_Group.png"
            alt="Mask Group"
          />

          <div className="w-[400px] mx-auto flex items-center h-[300px]">
            <div>
              {stepperIndex === 0 && (
                <CompanyDetails
                  formData={formData}
                  handleChange={handleChange}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              )}
              {stepperIndex === 1 && <TermsAndConditions onAccept={handleTermsAccept} />}
              {stepperIndex === 2 && <Welcome />}
              {stepperIndex < 2 && (
                <div
                  onClick={handleSubmit}
                  className="OrangeButtonWithText-v2 flex justify-center py-2 w-[150px] mt-5 mx-auto cursor-pointer"
                  style={{ opacity: loading ? 0.6 : 1 }} // Disable button appearance when loading
                  disabled={loading} // Disable button interaction when loading
                >
                  {loading ? "Loading..." : "Next"}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

const CompanyDetails = ({ formData, handleChange, handleDrop, handleDragOver }) => {
  return (
    <>
      <img className="hidden md:flex w-96 absolute bottom-2 -left-0 h-[300px] z-20" src="/Svg/SignUp4.svg" alt="" />
      <div className="w-[500px]">
        <div className="flex flex-row justify-between">
          <div>
            <h5 className="poppins-regular text-xs mt-1 pb-1">Full Name</h5>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="p-2 poppins-light InputBorder w-[250px] rounded-xl"
            />
          </div>
          <div
            className="ml-3 h-28 rounded-full w-28 border-2 flex flex-col items-center justify-center drag-drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {formData.photo ? (
              <img src={URL.createObjectURL(formData.photo)} alt="Uploaded" className="h-full w-full object-cover rounded-full" />
            ) : (
              <>
                <p className="poppins-light text-xs text-center">Drag & Drop Photo</p>
                <input type="file" name="photo" className="hidden" onChange={handleChange} />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-3">
          <div className="w-[50%]">
            <h5 className="poppins-regular text-xs">Gender</h5>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-2 poppins-light InputBorder rounded-xl w-full"
            >
              <option className='poppins-light' value="">Select</option>
              <option className='poppins-light' value="Male">Male</option>
              <option className='poppins-light' value="Female">Female</option>
              <option className='poppins-light' value="Other">Other</option>
            </select>
          </div>
          <div>
            <h5 className="poppins-regular text-xs">Enter Your Age</h5>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="p-2 poppins-light InputBorder w-[100px] rounded-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const TermsAndConditions = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) => {
    setAccepted(e.target.checked);
  };

  useEffect(() => {
    onAccept(accepted);
  }, [accepted, onAccept]);

  return (
    <>
      <img className="hidden md:flex w-96 h-[250px] mt-10 z-20" src="/Svg/SignUp3.svg" alt="" />
      <div className="w-[500px] flex mt-3 items-center">
        <input type="checkbox" checked={accepted} onChange={handleChange} />
        <h1 className="ml-2">I confirm that I have read and accept the terms and conditions and privacy policy.</h1>
      </div>
    </>
  );
};

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      console.log(token);

      if (!token) {
        alert('No authentication token found. Please sign up again.');
        setIsLoading(false);
        return;
      }

      // Verify the token or perform login with the token
      const response = await axios.get('/auth/verifyToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        await setCookie('yourCookieName', 'u', { expires: 7 });
        setTimeout(() => {
          navigate('/');
          setIsLoading(false);
        }, 1000); // 1-second delay
      } else {
        navigate('/Login');
        alert('Token verification failed. Please log in again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during token verification:', error);
      alert('An error occurred during verification.');
      setIsLoading(false);
    }
  };

  const setCookie = (name, value, options) => {
    return new Promise((resolve) => {
      Cookies.set(name, value, options);
      resolve(); // Resolve the promise once the cookie is set
    });
  };

  return (
    <>
      <h1 className="text-xl poppins-semibold text-center mb-5">Account successfully created!</h1>
      <img className="hidden md:flex w-96 h-[300px] z-20" src="/Svg/Welcome.svg" alt="" />
      <div
        onClick={handleGetStarted}
        className="OrangeButtonWithText-v2 flex justify-center py-2 w-[150px] mt-5 mx-auto cursor-pointer"
      >
        <p>
          {isLoading ? "Loading..." : "Get Started"}
        </p>
      </div>
    </>
  );
};

const InputField = ({ name, value, onChange }) => {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 poppins-light InputBorder w-[200px] rounded-xl"
    />
  );
};

export default UserSignUp;