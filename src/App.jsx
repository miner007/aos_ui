import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function ConnectWalletPage({ handleWalletConnection, walletAddress }) {
    return (
        <div className="wallet-section">
            {walletAddress ? (
                <p>Connected wallet address: {walletAddress}</p>
            ) : (
                <button className="connect-button" onClick={handleWalletConnection}>Connect Wallet</button>
            )}
        </div>
    );
}

function TerminalPage({ walletAddress, procId, setProcId, launchTerminal, terminalLink, terminalRef }) {
    const handleTerminalLaunch = () => {
        if (!walletAddress) {
            alert('Please connect your wallet first.');
            return;
        }
        launchTerminal();
    };

    return (
        <div className="process-section">
            <input
                type="text"
                placeholder="Enter Process ID"
                value={procId}
                onChange={(e) => setProcId(e.target.value)}
            />
            <button className="process-button" onClick={handleTerminalLaunch} disabled={!walletAddress}>Open Terminal</button>
            {terminalLink && (
                <div ref={terminalRef} className="terminal-container">
                    <iframe title="AOS Terminal" src={terminalLink}></iframe>
                </div>
            )}
        </div>
    );
}

function DisconnectPage({ walletAddress, setWalletAddress }) {
    const handleDisconnect = () => {
        if (!walletAddress) {
            alert('No wallet connected.');
            return;
        }
        setWalletAddress(null);
        alert('Wallet disconnected');
    };

    return (
        <div className="disconnect-section">
            <button className="disconnect-button" onClick={handleDisconnect} disabled={!walletAddress}>Disconnect Wallet</button>
        </div>
    );
}

function App() {
    const terminalRef = useRef(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [procId, setProcId] = useState('');
    const [terminalLink, setTerminalLink] = useState('');

    const handleWalletConnection = async () => {
        if (window.arweaveWallet) {
            try {
                await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY']);
                const currentAddress = await window.arweaveWallet.getActiveAddress();
                setWalletAddress(currentAddress);
            } catch (error) {
                alert('Failed to connect to wallet: ' + error);
            }
        } else {
            alert('ArConnect wallet not detected');
        }
    };

    const launchTerminal = () => {
        if (procId) {
            setTerminalLink(`https://sh_ao.g8way.io/?processId=${procId}`);
            if (terminalRef.current) {
                terminalRef.current.style.display = 'block';
            }
        } else {
            alert('Process ID is required.');
        }
    };

    return (
        <Router>
            <div className="container">
                <header className="header">
                    <h1>Hyper. Parallel. Computer.</h1>
                    <nav className="navbar">
                        <ul>
                            <li><Link to="/">Connect Wallet</Link></li>
                            <li><Link to="/terminal">Terminal</Link></li>
                            <li><Link to="/disconnect">Disconnect</Link></li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<ConnectWalletPage handleWalletConnection={handleWalletConnection} walletAddress={walletAddress} />} />
                        <Route path="/terminal" element={<TerminalPage walletAddress={walletAddress} procId={procId} setProcId={setProcId} launchTerminal={launchTerminal} terminalLink={terminalLink} terminalRef={terminalRef} />} />
                        <Route path="/disconnect" element={<DisconnectPage walletAddress={walletAddress} setWalletAddress={setWalletAddress} />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <div className="links-section">
                        <h2>Cookbook Links</h2>
                        <ul>
                            <li><a href="https://x.com/aoTheComputer" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https://cookbook_ao.g8way.io/" target="_blank" rel="noopener noreferrer">Get Started With AO Cookbook</a></li>
                            <li><a href="https://ao.arweave.dev/" target="_blank" rel="noopener noreferrer">AO</a></li>
                        </ul>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
