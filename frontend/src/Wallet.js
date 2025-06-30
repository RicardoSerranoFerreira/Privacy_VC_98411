import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export default function Wallet() {
  const [holderDid, setHolderDid] = useState("");
  const [vcs, setVCs] = useState([]);
  const [newVCJson, setNewVCJson] = useState("");
  const [wallet, setWallet] = useState([]);


  const fetchVCs = async () => {
    if (!holderDid) {
      alert("Enter holder DID");
      return;
    }
    const res = await axios.get(`${API_URL}/wallet/list`, {
      params: { holder_did: holderDid },
    });
    setVCs(res.data);
  };

  const storeVC = async () => {
    if (!holderDid || !newVCJson) {
      alert("Enter holder DID and VC JSON");
      return;
    }
    try {
      const vc = JSON.parse(newVCJson);
      await axios.post(
        `${API_URL}/wallet/store?holder_did=${encodeURIComponent(holderDid)}`,
        vc
      );
      alert("VC stored");
      setNewVCJson("");
      await fetchVCs();
    } catch (e) {
      alert("Invalid VC JSON");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>VC Wallet</h2>
      <div>
        <label>Holder DID: </label>
        <input
          value={holderDid}
          onChange={(e) => setHolderDid(e.target.value)}
          style={{ width: "50%" }}
        />
        <button onClick={fetchVCs}>Fetch VCs</button>
      </div>
      <h3>Stored VCs</h3>
      {vcs.length === 0 && <p>No VCs stored</p>}
      {vcs.map((vc, idx) => (
        <pre key={idx} style={{ maxHeight: 150, overflow: "auto", border: "1px solid #ccc", padding: 5, marginBottom: 5 }}>
          {JSON.stringify(vc, null, 2)}
        </pre>
      ))}
      <hr />
      <h3>Add VC</h3>
      <textarea
        rows={10}
        cols={80}
        placeholder="Paste VC JSON here"
        value={newVCJson}
        onChange={(e) => setNewVCJson(e.target.value)}
      />
      <br />
      <button onClick={storeVC}>Store VC</button>
    </div>
  );
}
