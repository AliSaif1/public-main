import { useState, useEffect } from 'react';

const Search = () => {
  const [paymentAccount, setPaymentAccount] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  // Fetch payment accounts on component mount
  useEffect(() => {
    const fetchPaymentAccounts = async () => {
      const authToken = localStorage.getItem('authToken'); // Retrieve authToken from localStorage
      
      try {
        const response = await fetch('/api/getPaymentAccounts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Set Authorization header with Bearer token
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts); // Assuming the response contains an accounts array
        } else {
          setMessage('Failed to fetch payment accounts. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred while fetching payment accounts.');
      }
    };

    fetchPaymentAccounts();
  }, []); // Empty dependency array to run only on mount

  const handleAddPaymentAccount = async () => {
    // Logic to add payment account via API
    if (paymentAccount && accountHolderName && bankName) {
      const newAccount = { paymentAccount, accountHolderName, bankName };
      
      try {
        const authToken = localStorage.getItem('authToken'); // Retrieve authToken from localStorage
        
        const response = await fetch('/api/addPaymentAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Set Authorization header with Bearer token
          },
          body: JSON.stringify(newAccount),
        });

        if (response.ok) {
          setAccounts((prevAccounts) => [...prevAccounts, newAccount]);
          setMessage(`Payment account ${paymentAccount} added successfully.`);
          setPaymentAccount('');
          setAccountHolderName('');
          setBankName('');
        } else {
          setMessage('Failed to add payment account. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred while adding the payment account.');
      }
    } else {
      setMessage('Please fill in all fields to add the payment account.');
    }
  };

  const handleRequestWithdrawal = () => {
    // Logic to request withdrawal goes here
    if (withdrawalAmount && selectedAccount) {
      setMessage(`Withdrawal request of $${withdrawalAmount} submitted successfully to ${selectedAccount}.`);
      setWithdrawalAmount('');
    } else {
      setMessage('Please enter a valid amount for withdrawal and select an account.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Request Payment Withdrawal</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* Add Payment Account Section */}
        {accounts.length < 1 ? (
          <>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Account Holder Name:</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter your account holder name"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Bank Name:</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter your bank name"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Payment Account Number:</label>
              <input
                type="text"
                value={paymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
                placeholder="Enter your payment account number"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button 
                onClick={handleAddPaymentAccount} 
                className="bg-blue-600 text-white p-3 mt-2 w-full rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Payment Account
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Displaying Added Accounts */}
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Select Payment Account:</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">-- Select Account --</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account.paymentAccount}>
                    {account.accountHolderName} - {account.paymentAccount} ({account.bankName})
                  </option>
                ))}
              </select>
            </div>

            {/* Withdrawal Amount Section */}
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Withdrawal Amount:</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <button 
                onClick={handleRequestWithdrawal} 
                className="bg-green-600 text-white p-3 mt-2 w-full rounded-md hover:bg-green-700 transition duration-200"
              >
                Request Withdrawal
              </button>
            </div>
          </>
        )}

        {message && <p className="mt-5 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Search;