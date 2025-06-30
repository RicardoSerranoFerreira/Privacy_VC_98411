from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from models import VerifiableCredential
from crypto import verify, selective_disclosure
from issuer import qtsp_did, issued_vcs  # import issued_vcs here

router = APIRouter()

class VCVerificationRequest(BaseModel):
    vc_id: str  # the VC ID to verify
    reveal: Optional[List[str]] = None  # List of claim keys to reveal

class VCVerificationResponse(BaseModel):
    verified: bool
    message: str
    revealed_claims: Optional[Dict[str, Any]] = None

@router.post("/verify", response_model=VCVerificationResponse)
def verify_vc(request: VCVerificationRequest):
    vc = issued_vcs.get(request.vc_id)
    if not vc:
        raise HTTPException(status_code=404, detail="VC not found")
    proof = vc.proof
    if not proof:
        return VCVerificationResponse(verified=False, message="No proof found in stored VC")

    jws = proof.get("jws")
    jws = proof.get("jws")
    if not jws:
        return VCVerificationResponse(verified=False, message="No signature (jws) found in stored VC")

    pub_key = qtsp_did.public_key
    # Remover prova para verificar
    vc_dict = vc.dict(exclude={"proof"})

    try:
        valid = verify(vc_dict, jws, pub_key) #pub_key
    except Exception as e:
        return VCVerificationResponse(verified=False, message=f"Verification error: {str(e)}")
    if not valid:
        return VCVerificationResponse(verified=False, message="Invalid signature")

    revealed_claims = None
    if request.reveal:
        revealed_vc = selective_disclosure(vc_dict, request.reveal)
        revealed_claims = revealed_vc.get("credentialSubject")

    return VCVerificationResponse(
        verified=True,
        message="VC verified successfully",
        revealed_claims=revealed_claims
    )
