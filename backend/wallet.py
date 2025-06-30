from fastapi import APIRouter, HTTPException
from typing import List
from models import VerifiableCredential

router = APIRouter()

# In-memory wallet storage keyed by holder DID
wallet_storage: dict = {}

@router.post("/store")
def store_vc(holder_did: str, vc: VerifiableCredential):
    if holder_did not in wallet_storage:
        wallet_storage[holder_did] = []
    wallet_storage[holder_did].append(vc)
    return {"message": "VC stored"}

@router.get("/list", response_model=List[VerifiableCredential])
def list_vcs(holder_did: str):
    return wallet_storage.get(holder_did, [])
