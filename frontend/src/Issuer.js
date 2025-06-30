import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export default function Issuer() {
  const [did, setDid] = useState(null);
  const [claims, setClaims] = useState({
    name: "",
    email: "",
    age: "",
    course: "",
    department: "",
  });
  const [issuedVC, setIssuedVC] = useState(null);
  const [wallet, setWallet] = useState([]);

  const registerDID = async () => {
    const res = await axios.post(`${API_URL}/issuer/did/register`);
    setDid(res.data);
    setIssuedVC(null);
    setWallet([]);
  };

  const issueVC = async () => {
    if (!did) {
      alert("Register a DID first");
      return;
    }
    try {
      // Issue VC
      const res = await axios.post(`${API_URL}/issuer/vc/issue`, {
        subject_did: did.id,
        claims: claims,
      });
      setIssuedVC(res.data);

      // guardar na wallet
      await axios.post(
        `${API_URL}/wallet/store?holder_did=${encodeURIComponent(did.id)}`,
        res.data
      );

      const walletRes = await axios.get(
        `${API_URL}/wallet/list?holder_did=${encodeURIComponent(did.id)}`
      );
      setWallet(walletRes.data);
    } catch (error) {
      alert("Error issuing or storing VC: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>VC Issuer</h2>
      <button onClick={registerDID}>Register New DID</button>
      {did && <pre>DID: {did.id}</pre>}
      <hr />
      <h3>Issue Verifiable Credential</h3>
      <div>
        <label>Name: </label>
        <input
          value={claims.name}
          onChange={(e) => setClaims({ ...claims, name: e.target.value })}
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          value={claims.email}
          onChange={(e) => setClaims({ ...claims, email: e.target.value })}
        />
      </div>
      <div>
        <label>Age: </label>
        <input
          value={claims.age}
          onChange={(e) => setClaims({ ...claims, age: e.target.value })}
        />
      </div>
      <div>
        <label>Course: </label>
        <input
          value={claims.course}
          onChange={(e) => setClaims({ ...claims, course: e.target.value })}
        />
      </div>
      <div>
        <label>Department: </label>
        <input
          value={claims.department}
          onChange={(e) => setClaims({ ...claims, department: e.target.value })}
        />
      </div>
      <button onClick={issueVC}>Issue VC</button>

      {issuedVC && (
        <div>
          <h4>Issued VC</h4>
          <pre>{JSON.stringify(issuedVC, null, 2)}</pre>
        </div>
      )}

      {wallet.length > 0 && (
        <>
          <hr />
          <h3>Wallet Contents</h3>
          {wallet.map((vc, idx) => (
            <pre
              key={idx}
              style={{
                maxHeight: 150,
                overflow: "auto",
                border: "1px solid #ccc",
                padding: 5,
                marginBottom: 5,
              }}
            >
              {JSON.stringify(vc, null, 2)}
            </pre>
          ))}
        </>
      )}
    </div>
  );
}
