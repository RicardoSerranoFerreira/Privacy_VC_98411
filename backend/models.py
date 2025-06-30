from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class DID(BaseModel):
    id: str
    public_key: str
    private_key: str  # For simulation only

class VCIssuanceRequest(BaseModel):
    subject_did: str
    claims: Dict[str, Any]

class VerifiableCredential(BaseModel):
    context: List[str] = Field(default_factory=lambda: [
        "https://www.w3.org/2018/credentials/v1"
    ])
    id: str
    type: List[str] = Field(default_factory=lambda: ["VerifiableCredential", "eIDASCredential"])
    issuer: str
    issuanceDate: str
    credentialSubject: Dict[str, Any]
    proof: Optional[Dict[str, Any]]

class VCVerificationRequest(BaseModel):
    vc: VerifiableCredential
    reveal: Optional[List[str]] = None  # For selective disclosure: list of claims to reveal

class VCVerificationResponse(BaseModel):
    verified: bool
    message: str
    revealed_claims: Optional[Dict[str, Any]] = None
