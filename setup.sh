#!/bin/bash

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

echo "React frontend"

cd frontend
npm install

echo "Setup complete!"
echo "Correr Backend: uvicorn main:app --reload em ./backend"
echo "Correr Frontend: npm start em ./frontend"
