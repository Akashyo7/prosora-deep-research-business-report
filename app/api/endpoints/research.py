from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

class ResearchRequest(BaseModel):
    query: str
    depth: str = "basic"

MOTIA_API_URL = "http://localhost:3000"

@router.post("/research")
def start_research(request: ResearchRequest):
    try:
        response = requests.post(MOTIA_API_URL, json=request.dict())
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/research/status")
def get_status(requestId: str):
    try:
        response = requests.get(f"{MOTIA_API_URL}/research/status", params={"requestId": requestId})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/research/report")
def get_report(requestId: str):
    try:
        response = requests.get(f"{MOTIA_API_URL}/research/report", params={"requestId": requestId})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))