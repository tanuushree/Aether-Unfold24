"use client"
import React,{useState} from "react";
import { SiGooglenews } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import { TbChartCandleFilled } from "react-icons/tb";
import { GoogleLogin } from '@react-oauth/google';
import { useOkto} from 'okto-sdk-react';





const StepContent = ({ currentStep, formData, handleChange, handleCheckboxChange, handleMultiSelectChange }) => {
  const [creds,setCreds] = useState(null);

  const { createWallet , authenticate,getWallets } = useOkto();


  const handleWalletCreate = async() => {
    try {
      const walletsData = await createWallet();
      console.log(walletsData)
    } catch (error) {
      console.log(error)
    }
  }


  const handleSuccess = (response) => {
    console.log('Login Success:', response);
    // Process the response token or user details
    authenticate(response.credential, (result, error) => {
      if (result) {
          console.log('authentication successful',result);
      }
      if (error) {
          console.error('authentication error:', error);
      }
    });
  };



  

  const handleError = () => {
    console.error('Login Failed');
  };

  switch (currentStep) {
    case 0:
      return (
        <>
          <label className="block text-gray-700 font-medium mb-2">Bot Name</label>
          <input
            type="text"
            name="botName"
            value={formData.botName}
            onChange={handleChange}
            placeholder="Enter bot name"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          <label className="block text-gray-700 font-medium mb-2">Trading Objective</label>
          <select
            name="tradingObjective"
            value={formData.tradingObjective}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select objective</option>
            <option value="profit">Profit Maximization</option>
            <option value="risk">Risk Management</option>
            <option value="balance">Portfolio Balancing</option>
          </select>
        </>
      );
    case 1:
      return (
        <div className="space-y-4">
        <h2 className="text-xl font-semibold">Choose integrations to include</h2>
        <ul className="grid w-full gap-6 md:grid-cols-3">
          <li>
            <input type="checkbox" id="react-option" value="" className="hidden peer" required="" />
            <label
              htmlFor="react-option"
              className="inline-flex items-start w-36 h-36 p-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:text-blue-600 peer-checked:border-blue-600 hover:bg-gray-50"
            >
              <div className="block space-y-1">
                <SiGooglenews className="h-6 w-6 mb-2" />
                <div className="text-base font-semibold">Google News</div>
                <div className="text-xs">Analyzes market news for trend impacts</div>
              </div>
            </label>
          </li>
          <li>
            <input type="checkbox" id="flowbite-option" value="" className="hidden peer" />
            <label
              htmlFor="flowbite-option"
              className="inline-flex items-start w-36 h-36 p-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-blue-600 hover:bg-gray-50"
            >
              <div className="block space-y-1">
                <FaSquareXTwitter className="h-6 w-6 mb-2" />
                <div className="text-base font-semibold">X</div>
                <div className="text-xs">Tracks sentiment from tweets and hashtags</div>
              </div>
            </label>
          </li>
          <li>
            <input type="checkbox" id="angular-option" value="" className="hidden peer" />
            <label
              htmlFor="angular-option"
              className="inline-flex items-start w-36 h-36 p-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-blue-600 hover:bg-gray-50"
            >
              <div className="block space-y-1">
                <TbChartCandleFilled className="h-6 w-6 mb-2" />
                <div className="text-base font-semibold">Charts</div>
                <div className="text-xs">Predicts price trends using regression analysis</div>
              </div>
            </label>
          </li>
        </ul>
      </div>
      );
    case 2:
      return (
        <>
          <label className="block text-gray-700 font-medium mb-2">Connect your wallet</label>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </>
      );
      case 3:
      return (
        <>
          <label className="block text-gray-700 font-medium mb-2">Create your wallet</label>
          <button onClick={handleWalletCreate} >create wallet</button>
        </>
      );
    case 6:
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Review Your Settings</h3>
          <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(formData, null, 2)}</pre>
        </div>
      );
    default:
      return <div>Content for step {currentStep + 1}</div>;
  }
};

export default StepContent;
