import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from PineconeOperations import PineconeOperations

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI instance
app = FastAPI(
    title="Pinecone Vector Search API",
    description="API for managing vector database operations using Pinecone.",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize PineconeOperations with default index
pinecone_ops = PineconeOperations(default_index="cs336")

@app.get("/index/connect")
async def connect_index(index_name: Optional[str] = None):
    """
    Connect or reconnect to a specific Pinecone index
    """
    try:
        return pinecone_ops.reconnect_index(index_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

 
class QueryRequest(BaseModel):
    vector: str
    top_k: Optional[int] = 10
    namespace: Optional[str] = "default"

@app.post("/index/query")
async def query_index(request: QueryRequest):
    """
    Query the Pinecone index for similar vectors.
    """
    try:
        return pinecone_ops.query_data(
            query=request.vector,
            top_k=request.top_k,
            namespace=request.namespace,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
 

# Define a request model for the URL
class AddWebArticleRequest(BaseModel):
    url: str

@app.post('/index/add_web_article')
async def add_web_article(request: AddWebArticleRequest):
    try:
        url = request.url
        print(url)  # Debugging purposes
        return pinecone_ops.add_web_article(url=url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding web article: {str(e)}")