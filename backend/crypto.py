import nacl.signing
import nacl.encoding
import json

def generate_keypair():
    sk = nacl.signing.SigningKey.generate()
    pk = sk.verify_key
    return sk.encode(encoder=nacl.encoding.Base64Encoder).decode(), pk.encode(encoder=nacl.encoding.Base64Encoder).decode()

def sign(vc_json: dict, sk_b64: str):
    message = json.dumps(vc_json, sort_keys=True, separators=(',', ':'))
    print("Signing message:", message)  # Debug print
    sk = nacl.signing.SigningKey(sk_b64.encode(), encoder=nacl.encoding.Base64Encoder)
    signature = sk.sign(message.encode()).signature
    return nacl.encoding.Base64Encoder.encode(signature).decode()

def verify(vc_json: dict, signature_b64: str, pk_b64: str) -> bool:
    try:
        message = json.dumps(vc_json, sort_keys=True, separators=(',', ':'))
        print("Verifying message:", message)  # Debug print
        pk = nacl.signing.VerifyKey(pk_b64.encode(), encoder=nacl.encoding.Base64Encoder)
        signature = nacl.encoding.Base64Encoder.decode(signature_b64.encode())
        pk.verify(message.encode(), signature)
        return True
    except Exception as e:
        print("Verification failed:", e)
        return False


def selective_disclosure(vc_json: dict, reveal: list):
    # Return a copy of vc_json with only claims in reveal list
    disclosed = vc_json.copy()
    cs = disclosed.get("credentialSubject", {})
    if reveal:
        disclosed["credentialSubject"] = {k: cs[k] for k in reveal if k in cs}
    return disclosed
