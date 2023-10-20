import React, { useState, useEffect } from 'react';
// import RedEnvelopeForm from './components/RedEnvelopeForm';
// import RedEnvelopeList from './RedEnvelopeList';
import { ethers } from 'ethers';
// import './RedEnvelopeTemplate.css';


// Red envelop
function RedEnvelopeForm({ createRedEnvelope }) {
  const [redEnvelopes, setRedEnvelopes] = useState([]);
  const [envelopeId, setEnvelopeId] = useState('');
  const [amount, setAmount] = useState('');
  const [totalRecipients, setTotalRecipients] = useState('');

  const handleCreateRedEnvelope = async () => {
    try {
      await createRedEnvelope(envelopeId, ethers.utils.parseEther(amount), totalRecipients);
      // Update UI or display a success message
    } catch (error) {
      console.error('Error creating red envelope:', error.message);
      // Handle the error
    }
  }
  return (
    <div className="red-envelope-container" style = {{'max-width': '800px', 'margin': '0 auto', 'padding': '20px'}}>
    <h1>Red Envelope DApp</h1>
    <div className="red-envelope-form" style={{'background-color': '#a61c1c', 'padding': '20px', 'margin-top': '20px','border': '1px solid #ddd', 'border-radius': '5px'}}>
      <h2>Create Red Envelope</h2>
      <div className="input-group" style={{'margin': '10px 0'}}>
        <label style={{'display': 'block', 'margin-bottom': '5px'}}>Envelope ID:</label>
        <input
          type="text"
          value={envelopeId}
          onChange={(e) => setEnvelopeId(e.target.value)}
          style = {{'width': '100%', 'padding': '5px'}}
        />
      </div>
      <div className="input-group" style={{'margin': '10px 0'}}>
        <label style={{'display': 'block', 'margin-bottom': '5px'}}>Amount (ETH):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style = {{'width': '100%', 'padding': '5px'}}
        />
      </div>
      <div className="input-group" style={{'margin': '10px 0'}}>
        <label style={{'display': 'block', 'margin-bottom': '5px'}}>Total Recipients:</label>
        <input
          type="number"
          value={totalRecipients}
          onChange={(e) => setTotalRecipients(e.target.value)}
          style = {{'width': '100%', 'padding': '5px'}}
        />
      </div>
      <button onClick={createRedEnvelope} style={{"background-color": "#007bff", "color": "#fff", "border": "none","padding": "10px 20px", "cursor": "pointer"}}>Create</button>
    </div>
    <div className="red-envelope-list" style={{"margin-top": "20px"}}>
      {/* <h2>Red Envelopes</h2> */}
      <ul style={{"list-style": "none", "padding": "0"}}>
        {redEnvelopes.map((envelope, index) => (
          <li key={index} style={{"background-color": "#a61c1c", "border": "1px solid #ddd", "margin": "10px 0", "padding": "10px", "border-radius": "5px"}}>
            <p style={{"margin": "5px 0"}}>ID: {envelope.id}</p>
            <p style={{"margin": "5px 0"}}>Amount (ETH): {ethers.utils.formatEther(envelope.amount)}</p>
            <p style={{"margin": "5px 0"}}>Total Recipients: {envelope.totalRecipients}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

function DistributeRedEnvelopeForm({ distributeRedEnvelope }) {
  const [envelopeId, setEnvelopeId] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const addRecipient = () => {
    if (recipient && amount) {
      setRecipients([...recipients, { address: recipient, amount: amount }]);
      setRecipient('');
      setAmount('');
    }
  };

  const distribute = () => {
    // Convert the recipient data into a format suitable for your contract
    const distributionData = recipients.map((recipient) => ({
      address: recipient.address,
      amount: ethers.utils.parseEther(recipient.amount),
    }));

    distributeRedEnvelope(envelopeId, distributionData);
  };

  return (
    <div>
      <h2>Distribute Red Envelope</h2>
      <div className="input-group">
        <label>Envelope ID:</label>
        <input
          type="text"
          value={envelopeId}
          onChange={(e) => setEnvelopeId(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <label>Amount (ETH):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addRecipient}>Add Recipient</button>
      </div>
      {recipients.length > 0 && (
        <div className="recipient-list">
          <h3>Recipient List</h3>
          <ul>
            {recipients.map((recipient, index) => (
              <li key={index}>
                <p>Address: {recipient.address}</p>
                <p>Amount (ETH): {recipient.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={distribute}>Distribute</button>
    </div>
  );
}


function RedEnvelopeList({ redEnvelopes }) {
  return (
    <div>
      <h2>Red Envelopes</h2>
      <ul>
        {redEnvelopes.map((envelope, index) => (
          <li key={index}>
            <p>ID: {envelope.id}</p>
            <p>Amount (ETH): {ethers.utils.formatEther(envelope.amount)}</p>
            <p>Total Recipients: {envelope.totalRecipients}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [redEnvelopes, setRedEnvelopes] = useState([]);
  const [contract, setContract] = useState(null);

  // Initialize Ethereum provider and contract
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Replace with your contract address and ABI
        const contractAddress = '0x6Fc460F91153C1e556fCe758CFf848D35a9D6140';
        const contractABI = [
          "function createRedEnvelope(bytes32 envelopeId, uint256 amount, uint256 totalRecipients)",
          // Get the account balance
          "function getEnvelopeIdAtIndex(uint256) view returns (bytes32)",
          "function getNumberOfRedEnvelopes() returns (uint256)",
          "function getEnvelopeAmount(bytes32) returns (uint256)",
          "function getEnvelopeTotalRecipients(bytes32) returns (uint256)",
          "function distributeRedEnvelope(bytes32 envelopeId, address[] recipients)"
        ];
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      }
    }
    init();
  }, []);

  const createRedEnvelope = async (envelopeId, amount, totalRecipients) => {
    try {
      await contract.createRedEnvelope(envelopeId, amount, totalRecipients);
      // Fetch updated red envelopes from the blockchain
      const updatedRedEnvelopes = await fetchRedEnvelopes();
      setRedEnvelopes(updatedRedEnvelopes);
    } catch (error) {
      console.error('Error creating red envelope:', error.message);
      // Handle the error
    }
  }

  const fetchRedEnvelopes = async () => {
    try {
      // Call a function on your smart contract to get the number of red envelopes
      // const numRedEnvelopes = await contract.getNumberOfRedEnvelopes();
      const numRedEnvelopes = 2;
  
      // Initialize an array to store the red envelopes
      const redEnvelopes = [];
  
      // Loop through the red envelopes and fetch details
      for (let i = 0; i < numRedEnvelopes; i++) {
        // const envelopeId = await contract.getEnvelopeIdAtIndex("0").toString();
        // const amount = await contract.getEnvelopeAmount("0x1000000000000000000000000000000000000000000000000000000000000000").toString();
        // const totalRecipients = await contract.getEnvelopeTotalRecipients("0x1000000000000000000000000000000000000000000000000000000000000000").toString();
        
        const envelopeId = 2;
        const amount = 10000000;
        const totalRecipients = 10;
        // Push the envelope details to the array
        redEnvelopes.push({
          id: envelopeId,
          amount,
          totalRecipients,
        });
      }
  
      return redEnvelopes;
    } catch (error) {
      console.error('Error fetching red envelopes:', error.message);
    return [];
    }
  }

  // Fetch red envelopes when the component mounts
  useEffect(() => {
    fetchRedEnvelopes().then((redEnvelopes) => setRedEnvelopes(redEnvelopes));
  }, []);
  return (
    <div>
      {/* <h1>Red Envelope DApp</h1> */}
      <RedEnvelopeForm createRedEnvelope={createRedEnvelope} />
      <RedEnvelopeList redEnvelopes={redEnvelopes} />
      <DistributeRedEnvelopeForm/>
    </div>
  );
}

export default App;