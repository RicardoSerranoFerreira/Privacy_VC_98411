from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from issuer import router as issuer_router
from wallet import router as wallet_router
from verifier import router as verifier_router

app = FastAPI(title="eIDAS 2.0 VC Ecosystem Simulator")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issuer_router, prefix="/issuer", tags=["Issuer"])
app.include_router(wallet_router, prefix="/wallet", tags=["Wallet"])
app.include_router(verifier_router, prefix="/verifier", tags=["Verifier"])
