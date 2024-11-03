import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import "./index.css";

const BrandSignUp = () => {
  const [stepperIndex, setStepperIndex] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    brandName: "",
    position: "",
    companySize: "",
    influencersWorkedWith: "",
    website: "",
    logo: null,
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userIdFromCookie = Cookies.get("userId");
    const userIdFromState = location.state?.userId;
    setFormData((prevData) => ({
      ...prevData,
      userId: userIdFromCookie || userIdFromState || "",
    }));
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "select-multiple") {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.selectedOptions, (option) => option.value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFormData({ ...formData, logo: file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTermsAccept = (accepted) => {
    setTermsAccepted(accepted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      userId,
      brandName,
      position,
      companySize,
      influencersWorkedWith,
      website,
      logo,
      category,
    } = formData;
  
    
    console.log("Form Data:", formData);
  
    // Validation based on stepperIndex
    if (stepperIndex === 0) {
      // Validate fields for step 0
      if (!position || !companySize || !influencersWorkedWith) {
        alert("Please fill in all fields in the Basic Details step.");
        return;
      }
      // Proceed to the next step
      setStepperIndex(stepperIndex + 1);
    } else if (stepperIndex === 1) {
      // Validate fields for step 1
      if (!brandName || !website || !logo) {
        console.log("Logo:", logo);
        console.log("brandName:", brandName);
        console.log("website:", website);
        console.log("logo:", logo);
        console.log("category:", category);
  
        alert("Please fill in all fields in the Company Details step.");
        return;
      }
  
      if (category.length === 0) {
        alert("Please select at least one category.");
        return;
      }
      // Proceed to the next step
      setStepperIndex(stepperIndex + 1);
    } else if (stepperIndex === 2) {
      if (!termsAccepted) {
        alert("Please accept the terms and conditions.");
        return;
      }


    // Check if userId is valid
    if (!userId || userId.trim() === "") {
      alert("User ID is invalid. Please log in again.");
      return;
    }
  
      const data = new FormData();
      data.append("userId", userId);
      data.append("brandName", brandName);
      data.append("position", position);
      data.append("companySize", companySize);
      data.append("influencersWorkedWith", influencersWorkedWith);
      data.append("website", website);
      if (logo) {
        data.append("logo", logo);
      }
      data.append("category", JSON.stringify(category));
  
      // Handle form submission for final step
      setLoading(true);
  
      try {
        await axios.post("/api/Brand", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setStepperIndex(stepperIndex + 1); // Move to the next step or confirmation
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // For any additional steps, you can handle them here
      setStepperIndex(stepperIndex + 1); // Move to next step if needed
    }
  };
  
  return (
    <div className=" w-full h-screen items-center sm:h-[550px] lg:h-screen flex text-10px bgSignUp text-[12px] ">
      <motion.div
        layout
        className={`${
          stepperIndex < 3 ? "w-10/12" : "w-11/12"
        } mx-auto BarColor my-10 h-[350px] xs:h-[400px] sm:h-[520px] rounded-3xl overflow-hidden relative`}
      >
        <div className="flex flex-col mx-10 pt-2">
          <div className="flex justify-between mx-10 items-center">
            <img
              className="bg-transparent w-8 sm:w-12 lg:w-56"
              src="/Logo/LogoText.jpg"
              alt="Logo"
            />
            <h1 className="BlackButtonWithText-v1 hidden sm:flex poppins-semibold border-2 text-center text-white rounded-xl bg-black h-[34px] items-center text-[7px] sm:text-[10px] px-4">
              Home
            </h1>
          </div>
          <div className="w-[700px] mt-10 mx-auto flex justify-between items-center">
            {stepperIndex > 0 && stepperIndex < 3 && (
              <img
                className="cursor-pointer"
                onClick={() => setStepperIndex(stepperIndex - 1)}
                src="/Svg/BackButton.svg"
                alt="Back"
              />
            )}
            <div className="flex-grow">
              {stepperIndex < 3 && (
                <NavBar
                  stepperIndex={stepperIndex}
                  nextStep={() => setStepperIndex(stepperIndex + 1)}
                  prevStep={() => setStepperIndex(stepperIndex - 1)}
                  setStepperIndex={setStepperIndex}
                />
              )}
            </div>
          </div>

          <motion.img
            layout
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={`absolute hidden md:block -right-[150px] -bottom-2 -z-10`}
            src="/Images/Mask_Group.png"
            alt="Mask Group"
          />

          <div className="w-[400px] mx-auto flex items-center h-[300px]">
            <div>
              {stepperIndex === 0 && (
                <BasicDetails
                  formData={formData}
                  handleChange={handleChange}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              )}
              {stepperIndex === 1 && (
                <CompanyDetails
                  formData={formData}
                  handleChange={handleChange}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              )}
              {stepperIndex === 2 && (
                <TermsAndConditions onAccept={handleTermsAccept} />
              )}
              {stepperIndex === 3 && <Welcome />}
              {stepperIndex < 3 && (
                <div
                  onClick={handleSubmit}
                  className="OrangeButtonWithText-v2 flex justify-center py-2 w-[150px] mt-5 mx-auto cursor-pointer"
                  style={{ opacity: loading ? 0.6 : 1 }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Next"}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BasicDetails = ({ formData, handleChange }) => {
  const [selectedCompanySize, setSelectedCompanySize] = useState(
    formData.companySize || ""
  );
  const [selectedInfluencers, setSelectedInfluencers] = useState(
    formData.influencersWorkedWith || ""
  );

  const handleCompanySizeClick = (value) => {
    setSelectedCompanySize(value);
    handleChange({ target: { name: "companySize", value } });
  };

  const handleInfluencersClick = (value) => {
    setSelectedInfluencers(value);
    handleChange({ target: { name: "influencersWorkedWith", value } });
  };

  return (
    <div>
      <h5 className="poppins-regular text-xs mt-3 pb-1">
        Which describes your position?
      </h5>
      <select
        name="position"
        value={formData.position}
        onChange={handleChange}
        className="p-2 poppins-light InputBorder w-full rounded-xl"
      >
        <option className="poppins-light" value="" disabled>
          Select your position
        </option>
        <option className="poppins-light" value="Sales">
          Sales
        </option>
        <option className="poppins-light" value="Manager">
          Manager
        </option>
        <option className="poppins-light" value="Other">
          Other
        </option>
      </select>

      <img
        className="hidden md:flex w-96 absolute -bottom-2 -right-10 z-20"
        src="/Svg/SignUp1.svg"
        alt=""
      />

      <h5 className="poppins-regular text-xs mt-5">How big is your Company?</h5>
      <div className="flex flex-row mt-3 justify-center flex-wrap gap-2">
        {["Only Me", "10-20", "50-100", "100-500", "500+"].map((size) => (
          <CategoryItem
            key={size}
            value={size}
            onClick={handleCompanySizeClick}
            selected={selectedCompanySize === size}
          />
        ))}
      </div>

      <h5 className="poppins-regular text-xs mt-5">
        How many Influencers did you work with last month?
      </h5>
      <div className="flex flex-row mt-3 gap-2">
        {["0", "1-10", "11-50", "50+"].map((count) => (
          <CategoryItem
            key={count}
            value={count}
            onClick={handleInfluencersClick}
            selected={selectedInfluencers === count}
          />
        ))}
      </div>
    </div>
  );
};


const CompanyDetails = ({
  formData,
  handleChange,
  handleDrop,
  handleDragOver,
}) => {
  const [selectedCategories, setSelectedCategories] = useState(
    formData.category
  );

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(category)
        ? prevCategories.filter((item) => item !== category)
        : [...prevCategories, category];

      if (newCategories.length > 2) {
        alert("You can select a maximum of 2 categories.");
        return prevCategories;
      }

      handleChange({ target: { name: "category", value: newCategories } });
      return newCategories;
    });
  };

  return (
    <>
      <img
        className="hidden md:flex w-96 absolute bottom-2 -left-0 h-[300px] z-20"
        src="/Svg/SignUp4.svg"
        alt=""
      />
      <div className="w-[500px]">
        <div className="flex flex-row justify-between">
          <div>
            <h5 className="poppins-regular text-xs mt-1 pb-1">Brand Name</h5>
            <input
              name="brandName"
              value={formData.Name}
              onChange={handleChange}
              className="p-2 poppins-light InputBorder w-[250px] rounded-xl"
            />
            <h5 className="poppins-regular text-xs mt-1 pb-1">Website Link</h5>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="p-2 poppins-light InputBorder w-[350px] rounded-xl"
            />
          </div>
          <div
            className="ml-3 h-28 rounded-full w-28 border-2 flex flex-col items-center justify-center drag-drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {formData.logo ? (
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Uploaded"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <>
                <p className="poppins-light text-xs text-center">Upload logo</p>
                <input
                  type="file"
                  name="logo"
                  className="hidden"
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        </div>

        <h5 className="poppins-regular text-xs mt-3 pb-1">Category</h5>
        <div className="flex flex-row mt-1 gap-2">
          {["Fashion", "Travel", "Media", "Other"].map((category) => (
            <CategoryItem
              key={category}
              value={category}
              onClick={handleCategoryClick}
              selected={selectedCategories.includes(category)}
            />
          ))}
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
      <img
        className="hidden md:flex w-96 h-[250px] mt-10 z-20"
        src="/Svg/SignUp3.svg"
        alt=""
      />
      <div className="w-[500px] flex mt-3 items-center">
        <input type="checkbox" checked={accepted} onChange={handleChange} />
        <h1 className="ml-2">
          I confirm that I have read and accept the terms and conditions and
          privacy policy.
        </h1>
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
      const token = localStorage.getItem("authToken");
      console.log(token);

      if (!token) {
        alert("No authentication token found. Please sign up again.");
        setIsLoading(false);
        return;
      }

      // Verify the token or perform login with the token
      const response = await axios.get("/auth/verifyToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        await setCookie("yourCookieName", "b", { expires: 7 });
        setTimeout(() => {
          navigate("/Dashboard/OverView");
          setIsLoading(false);
        }, 1000); // 1-second delay
      } else {
        navigate("/Login");
        alert("Token verification failed. Please log in again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during token verification:", error);
      alert("An error occurred during verification.");
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
      <h1 className="text-xl poppins-semibold text-center mb-5">
        Account successfully created!
      </h1>
      <img
        className="hidden md:flex w-96 h-[300px] z-20"
        src="/Svg/Welcome.svg"
        alt=""
      />
      <div
        onClick={handleGetStarted}
        className="OrangeButtonWithText-v2 flex justify-center py-2 w-[150px] mt-5 mx-auto cursor-pointer"
      >
        <p>{isLoading ? "Loading..." : "Get Started"}</p>
      </div>
    </>
  );
};

const CategoryItem = ({ value, onClick, selected }) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={`InputBorder w-20 flex flex-row justify-center py-2 rounded-xl poppins-light cursor-pointer ${
        selected ? "bg-[#FB773F] text-white" : "bg-white text-black"
      }`}
    >
      <p>{value}</p>
    </div>
  );
};

export default BrandSignUp;
