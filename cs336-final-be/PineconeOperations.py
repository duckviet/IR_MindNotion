import os
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv, find_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import time
from openai import OpenAI
from RankFusion import RankFusion  # Import Pinecone Operations
from ScrapeWebContent import ScrapeWebContent
import uuid  # For generating unique document IDs


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

class PineconeOperations:
    def __init__(self, api_key: Optional[str] = None, default_index: str = "cs336"):
        """
        Initialize Pinecone connection with a default index
        """
        try:
            # Load environment variables
            load_dotenv(find_dotenv())
            
            # Get API key from parameter or environment
            self.api_key = api_key or os.getenv('PINECONE_KEY')
            
            if not self.api_key:
                raise ValueError("Pinecone API key is required")
            
            # Create Pinecone client
            self.pc = Pinecone(api_key=self.api_key)
            
            # Connect to default index
            self.default_index_name = default_index
            self.index = self._connect_to_index(default_index)
            
            self.rank_fusion = RankFusion()

            logger.info(f"Pinecone initialized successfully with default index: {default_index}")
        
        except Exception as e:
            logger.error(f"Pinecone initialization error: {e}")
            raise

    def _connect_to_index(self, index_name: str):
        """
        Private method to connect to a specific Pinecone index
        """
        try:
            # Verify index exists
            indexes = self.pc.list_indexes()
            existing_indexes = [idx.name for idx in indexes.indexes]
            
            if index_name not in existing_indexes:
                raise ValueError(f"Index {index_name} does not exist")
            
            # Connect to the index
            index = self.pc.Index(index_name)
            
            logger.info(f"Connected to index: {index_name}")
            return index
        
        except Exception as e:
            error_msg = f"Failed to connect to index {index_name}. Error: {str(e)}"
            logger.error(error_msg)
            raise

    def reconnect_index(self, index_name: Optional[str] = None):
        """
        Reconnect to the specified index or the default index
        """
        try:
            target_index = index_name or self.default_index_name
            self.index = self._connect_to_index(target_index)
            return {"message": f"Reconnected to index {target_index}"}
        
        except Exception as e:
            logger.error(f"Reconnection error: {e}")
            raise

    def query_data(
        self,
        query: str,
        top_k: int = 10,
        namespace: str = "default",
        include_metadata: bool = True,
    ):
        if not self.index:
            self.reconnect_index()

        try:
            embeddings = self.pc.inference.embed(
                model="multilingual-e5-large",
                inputs=[query],
                parameters={"input_type": "passage", "truncate": "END"}
            )
            
            response = self.index.query(
                vector=embeddings[0].values,
                top_k=top_k,
                namespace=namespace,
                include_metadata=include_metadata,
            )

            # Combine results using rank fusion
            combined_sum_results = self.rank_fusion.comb_sum(
                response['matches'], 
                response['matches']
            )

            combined_mnz_results = self.rank_fusion.comb_mnz(
                response['matches'], 
                response['matches']
            )

            clean_response = {
                "result": [
                    {
                        'embed':'multilingual-e5-large',
                        "matches": [
                            {
                                "id": match["id"],
                                "score": match["score"],
                                "metadata": {
                                    key: value if not isinstance(value, list) else str(value)
                                    for key, value in match["metadata"].items()
                                },
                            }
                            for match in response.get("matches", [])
                        ],
                        "namespace": response.get("namespace"),
                    },
                    {
                        'embed':'combsum',
                        'matches': combined_sum_results,
                        "namespace": response.get("namespace"),
                    },   
                    {
                        'embed':'combmnz',
                        'matches': combined_mnz_results,
                        "namespace": response.get("namespace"),
                    }
                ]
            }

            logger.info(f"Query completed. Top {top_k} results retrieved.")
            return clean_response

        except Exception as e:
            logger.error(f"Error during query: {e}")
            raise
        
    def add_web_article(self, url: str = ''):
        try:
            # Ensure the Pinecone index is connected
            if not self.index:
                self.reconnect_index()
            
            # Scrape the content from the URL
            scrape = ScrapeWebContent()
            scrape_data = scrape.extract_article_info(url)
            
            # Combine all paragraphs into a single text for embedding
            combined_paragraphs = " ".join(scrape_data['paragraphs'])
            
            # Generate embeddings for the combined text
            embeddings = self.pc.inference.embed(
                model="multilingual-e5-large",
                inputs=[combined_paragraphs],  # Model expects a list of strings
                parameters={"input_type": "passage", "truncate": "END"}
            )
            
            # Generate a unique ID for the document
            unique_id = f"doc_{uuid.uuid4()}"
            
            # Prepare Pinecone upsert payload
            pinecone_item = {
                "id": unique_id,
                "vector": embeddings[0].values,  # Use the first (and only) embedding from the response
                "metadata": {
                    "title": scrape_data["title"],
                    "description": scrape_data["description"],
                    "author_name": scrape_data["author_name"],
                    "author_username": scrape_data["author_username"],
                    "reputation": scrape_data["reputation"],
                    "followers": scrape_data["followers"],
                    "posts": scrape_data["posts"],
                    "url": scrape_data["url"],
                    "paragraphs": scrape_data["paragraphs"]
                }
            }
            
      
            # Upsert the document into the Pinecone index
            self.index.upsert(
                vectors=[{
                    "id": pinecone_item["id"],
                    "values": pinecone_item["vector"],  # Embedding vector (list of floats)
                    "metadata": pinecone_item["metadata"]
                }],
                namespace='cs336'
            )
            
            logger.info(f"Successfully added article content from URL: {url}")
            return {"status": "success", "message": f"Article content added with ID: {unique_id}"}
        
        except Exception as e:
            logger.error(f"Error adding article content: {e}")
            raise
