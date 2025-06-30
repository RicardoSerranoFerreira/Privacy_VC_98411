from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import Dict
import uuid

from models import VCIssuanceRequest, VerifiableCredential, DID
from crypto import sign, generate_keypair

router = APIRouter()

# QTSP Simulado de DID
qtsp_did = DID(
    id="did:example:qtsp",
    public_key="",
    private_key=""
)

# guardo em memória
dids: Dict[str, DID] = {}
issued_vcs: Dict[str, VerifiableCredential] = {}

def setup_qtsp_keys():
    sk, pk = generate_keypair()
    qtsp_did.public_key = pk
    qtsp_did.private_key = sk

setup_qtsp_keys()

@router.post("/did/register", response_model=DID)
def register_did():
    sk, pk = generate_keypair()
    did_id = f"did:example:{str(uuid.uuid4())[:8]}"
    did = DID(id=did_id, public_key=pk, private_key=sk)
    dids[did_id] = did
    return did

@router.post("/vc/issue", response_model=VerifiableCredential)
def issue_vc(request: VCIssuanceRequest):
    subject_did = request.subject_did
    if subject_did not in dids:
        raise HTTPException(400, detail="Subject DID not registered")

    vc_id = f"urn:uuid:{str(uuid.uuid4())}"
    issuanceDate = datetime.now(timezone.utc).isoformat()

    vc_data = {
        "id": vc_id,
        "issuer": qtsp_did.id,
        "issuanceDate": issuanceDate,
        "credentialSubject": {"id": subject_did, **request.claims},
    }
    signature = sign(vc_data, qtsp_did.private_key)
    vc_data["proof"] = {
        "type": "Ed25519Signature2020",
        "created": issuanceDate,
        "proofPurpose": "assertionMethod",
        "verificationMethod": f"{qtsp_did.id}#key-1",
        "jws": signature,
    }
    # Criar com a prova
    vc = VerifiableCredential(**vc_data)

    issued_vcs[vc.id] = vc
    return vc

