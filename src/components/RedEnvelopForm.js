import React, { useState } from 'react';
import { ethers } from 'ethers';

function RedEnvelopeForm({ createRedEnvelope }) {
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
    <div>
      <h2>Create Red Envelope</h2>
      <label>Envelope ID: </label>
      <input
        type="text"
        value={envelopeId}
        onChange={(e) => setEnvelopeId(e.target.value)}
      />
      <label>Amount (ETH): </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <label>Total Recipients: </label>
      <input
        type="number"
        value={totalRecipients}
        onChange={(e) => setTotalRecipients(e.target.value)}
      />
      <button onClick={handleCreateRedEnvelope}>Create</button>
    </div>
  );
}

export default RedEnvelopeForm;