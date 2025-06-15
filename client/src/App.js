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
    const fetchLoanCount = async () => {
      if (!window.ethereum) return;
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const count = await contract.loanCount();
        setLoanCount(Number(count));

        const loansArray = [];
      for (let i = 0; i < count; i++) {
        const loan = await contract.loans(i);
        loansArray.push({ id: i, ...loan });
      }
      setLoans(loansArray);

      } catch (err) {
        console.error('Failed to fetch loan count:', err);
      } finally {
        setLoading(false);
      }
    };

    if (connected) fetchLoanCount();
  }, [connected]);

  const handleFundLoan = async (id, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.fundLoan(id, { value: amount });
    await tx.wait();
    alert("Loan funded!");
  } catch (err) {
    console.error("Funding failed", err);
    alert("Funding failed");
  }
};

const handleRepayLoan = async (id, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.repayLoan(id, { value: amount });
    await tx.wait();
    alert("Loan repaid!");
  } catch (err) {
    console.error("Repayment failed", err);
    alert("Repayment failed");
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
  <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📚 Active Loans</h2>
  {loans.map((loan) => (
    <Card key={loan.id} className="p-4 bg-white rounded shadow">
      <p><strong>Borrower:</strong> {loan.borrower}</p>
      <p><strong>Amount:</strong> {ethers.formatEther(loan.amount)} ETH</p>
      <p><strong>Repay:</strong> {ethers.formatEther(loan.repayAmount)} ETH</p>
      <p><strong>Duration:</strong> {Number(loan.duration)}s</p>
      <p><strong>Funded:</strong> {loan.funded ? "✅" : "❌"}</p>
      <p><strong>Repaid:</strong> {loan.repaid ? "✅" : "❌"}</p>

      {!loan.funded && (
        <Button onClick={() => handleFundLoan(loan.id, loan.amount)} className="mt-2">
          💰 Fund Loan
        </Button>
      )}

      {loan.funded && !loan.repaid && loan.borrower.toLowerCase() === account?.toLowerCase() && (
        <Button onClick={() => handleRepayLoan(loan.id, loan.repayAmount)} className="mt-2">
          💵 Repay Loan
        </Button>
      )}
    </Card>
  ))}
</div>

    </div>
  );
}

export default App;
