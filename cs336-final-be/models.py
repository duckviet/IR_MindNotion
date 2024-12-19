# models.py
from pydantic import BaseModel, Field
# from pydantic import BaseModel
from typing import List, Any

class Article(BaseModel):
    id: str
    content: str
    vector: List[float]
    
# class Article(BaseModel):
#     title: str = Field(..., min_length=1, max_length=50)
#     metadata_description: str = Field(..., min_length=1, max_length=50)
#     description: str = Field(..., min_length=1, max_length=50)
#     author_name: str = Field(..., min_length=1, max_length=50)
#     author_username: str = Field(..., min_length=1, max_length=50)
#     reputation: str = Field(..., min_length=1, max_length=50)
#     followers: str = Field(..., min_length=1, max_length=50)
#     posts: str = Field(..., min_length=1, max_length=50) 
    
# class Item(Article):
#     id: str
#     score: float
