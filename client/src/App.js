import Card from './components/ui/card';
import Button from './components/ui/button';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function App() {
  const [loanCount, setLoanCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);

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
      } catch (err) {
        console.error('Failed to fetch loan count:', err);
      } finally {
        setLoading(false);
      }
    };

    if (connected) fetchLoanCount();
  }, [connected]);

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
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">📊 Loan Stats</h2>
            <p className="text-lg">Total Loans Created: <span className="font-bold text-indigo-700">{loanCount}</span></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
