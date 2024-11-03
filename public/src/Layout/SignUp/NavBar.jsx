import UserIcon from '../../Components/Svg/UserIcon';
import Company from '../../Components/Svg/Company';
import Tick from '../../Components/Svg/Tick';

const NavBar = ({ stepperIndex, nextStep, prevStep, setStepperIndex ,check=true}) => {
  const steps = check? [
    { icon: <UserIcon color={stepperIndex >= 0 ? 'white' : 'black'} />, label: 'Basic Details' },
    { icon: <Company color={stepperIndex >= 1 ? 'white' : 'black'} />, label: 'Company Details' },
    { icon: <Tick color={stepperIndex >= 2 ? 'white' : 'black'} />, label: 'Submit' },
  ]:[
    { icon: <UserIcon color={stepperIndex >= 0 ? 'white' : 'black'} />, label: 'Basic Details' },
    { icon: <Tick color={stepperIndex >= 2 ? 'white' : 'black'} />, label: 'Submit' },
  ]

  return (
    <div className="poppins-semibold text-[10px]">
      <div className="stepper">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step ${i === stepperIndex ? 'active' : ''} ${i < stepperIndex ? 'completed' : ''}`}
            onClick={() => setStepperIndex(i)}
          >
            <div className="stepDetails">
              {step.icon}
              <span>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
