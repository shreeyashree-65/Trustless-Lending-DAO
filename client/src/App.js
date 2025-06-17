import Card from './components/ui/card';
import Button from './components/ui/button';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import { Loader2 } from 'lucide-react';

function App() {
  const [loanCount, setLoanCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState('all');


  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setConnected(true);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  const handleRequestLoan = async () => {
  if (!loanAmount || !repayAmount || !duration) return alert('Please fill all fields');
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.requestLoan(
      ethers.parseEther(loanAmount),
      ethers.parseEther(repayAmount),
      duration
    );
    await tx.wait();

    alert('Loan requested successfully!');
    setLoanAmount('');
    setRepayAmount('');
    setDuration('');

    const count = await contract.loanCount();
    setLoanCount(Number(count));
  } catch (err) {
    console.error('Request loan failed:', err);
    alert('Transaction failed');
  }
};


  useEffect(() => {
    const fetchLoanData = async () => {
      if (!window.ethereum) return;
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const count = await contract.loanCount();
        setLoanCount(Number(count));

        const fetchedLoans = [];
      for (let i = 0; i < Number(count); i++) {
        const loan = await contract.loans(i);
        fetchedLoans.push({
    id: i,
    borrower: loan.borrower,
    amount: ethers.formatEther(loan.amount),
    repayAmount: ethers.formatEther(loan.repayAmount),
    duration: Number(loan.duration),
    funded: loan.funded,
    repaid: loan.repaid
  });
      }
      setLoans(fetchedLoans);

      } catch (err) {
        console.error('Failed to fetch loan count:', err);
      } finally {
        setLoading(false);
      }
    };

    if (connected) fetchLoanData();
  }, [connected, loanCount]);

  const handleFundLoan = async (loanId, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.fundLoan(loanId, { value: amount });
    await tx.wait();
    alert('Loan funded successfully!');
    setLoanCount((prev) => prev + 1);
  } catch (err) {
    console.error('Fund loan failed:', err);
    alert('Transaction failed');
  }
};

const handleRepayLoan = async (loanId, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.repayLoan(loanId, { value: amount });
    await tx.wait();
    alert('Loan repaid successfully!');
    window.location.reload();
  } catch (err) {
    console.error('Repay loan failed:', err);
    alert('Transaction failed');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">Trustless Lending DAO 💸</h1>

      {!connected ? (
        <Button onClick={connectWallet} className="mb-6">🔗 Connect Wallet</Button>
      ) : (
        <div className="text-gray-700 mb-4">Connected as <span className="font-semibold">{account}</span></div>
      )}

      {loading ? (
        <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
      ) : (
        <Card className="w-full max-w-md shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">📊 Loan Stats</h2>
            <p className="text-lg">Total Loans Created: <span className="font-bold text-indigo-700">{loanCount}</span></p>
          </div>
        </Card>
      )}
      <div className="w-full max-w-md mt-6 p-4 bg-white rounded shadow">
  <h3 className="text-lg font-semibold mb-2">📥 Request a Loan</h3>
  <input
    type="number"
    placeholder="Loan Amount (ETH)"
    className="border p-2 w-full mb-2"
    value={loanAmount}
    onChange={(e) => setLoanAmount(e.target.value)}
  />
  <input
    type="number"
    placeholder="Repay Amount (ETH)"
    className="border p-2 w-full mb-2"
    value={repayAmount}
    onChange={(e) => setRepayAmount(e.target.value)}
  />
  <input
    type="number"
    placeholder="Duration (seconds)"
    className="border p-2 w-full mb-4"
    value={duration}
    onChange={(e) => setDuration(e.target.value)}
  />
  <Button onClick={handleRequestLoan}>📤 Submit Loan Request</Button>
</div>


<div className="w-full max-w-2xl mt-10 space-y-4">
 <h3 className="text-lg font-semibold my-4">📂 Active Loans</h3>
{loans.length === 0 ? (
  <p className="text-gray-500">No active loans found.</p>
) : (
  loans.map((loan) => (
    <Card key={loan.id} className="p-4 border-l-4 border-indigo-500 bg-white shadow-md">
        <h4 className="text-lg font-bold mb-1">📄 Loan #{loan.id}</h4>
        <p><strong>Borrower:</strong> {loan.borrower}</p>
        <p><strong>Amount:</strong> {loan.amount} ETH</p>
        <p><strong>Repay:</strong> {loan.repayAmount} ETH</p>
        <p><strong>Duration:</strong> {loan.duration} seconds</p>
        <p><strong>Status:</strong> 
          {loan.repaid 
            ? ' ✅ Repaid' 
            : loan.funded 
              ? ' 💸 Funded' 
              : ' 🔍 Open for Funding'}
        </p>

        {!loan.funded && !loan.repaid && (
  <Button
    className="mt-2"
    onClick={() => handleFundLoan(loan.id, ethers.parseEther(loan.amount))}
  >
    💰 Fund this Loan
  </Button>
)}

{loan.funded && !loan.repaid && account?.toLowerCase() === loan.borrower.toLowerCase() && (
  <Button
    className="mt-2 bg-green-600 hover:bg-green-700"
    onClick={() => handleRepayLoan(loan.id, ethers.parseEther(loan.repayAmount))}
  >
    💵 Repay Loan
  </Button>
)}

      </Card>
  ))
)}

</div>
<div className="flex space-x-2 my-4">
  <Button onClick={() => setFilter('all')}>All Loans</Button>
  <Button onClick={() => setFilter('borrower')}>My Borrowed Loans</Button>
  <Button onClick={() => setFilter('lender')}>My Funded Loans</Button>
</div>

    </div>
  );
}

export default App;
