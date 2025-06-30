import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export default function Verifier() {
  const [vcId, setVcId] = useState("");
  const [reveal, setReveal] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      let revealList = [];
      if (reveal.trim().length > 0) {
        revealList = reveal.split(",").map((r) => r.trim());
      }
      const res = await axios.post(`${API_URL}/verifier/verify`, {
        vc_id: vcId,
        reveal: revealList.length > 0 ? revealList : undefined,
      });
      setResult(res.data);
    } catch (e) {
      console.error("Erro atual", e);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>VC Verifier</h2>
      <input
        style={{ width: "80%", marginBottom: 10 }}
        placeholder="Enter VC ID (e.g. urn:uuid:...)"
        value={vcId}
        onChange={(e) => setVcId(e.target.value)}
      />
      <div style={{ marginBottom: 10 }}>
        <label>Selective Disclosure - Claims to Reveal (comma separated): </label>
        <input
          style={{ width: "50%" }}
          value={reveal}
          onChange={(e) => setReveal(e.target.value)}
          placeholder="e.g. name,email"
        />
      </div>
      <button onClick={verify}>Verify VC</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Verification Result</h3>
          <p>
            Verified: <b>{result.verified ? "Yes" : "No"}</b>
          </p>
          <p>Message: {result.message}</p>
          {result.revealed_claims && (
            <>
              <h4>Revealed Claims:</h4>
              <pre>{JSON.stringify(result.revealed_claims, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
