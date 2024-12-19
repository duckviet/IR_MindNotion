# import torch
# from transformers import AutoTokenizer, AutoModel
# from typing import List, Union
# import torch.nn as nn

# class EmbeddingService:
#     def __init__(self, model_name='bert-large-uncased'):  # Use BERT large instead of BERT base
#         self.bert_tokenizer = AutoTokenizer.from_pretrained(model_name)
#         self.bert_model = AutoModel.from_pretrained(model_name)
#         self.bert_model.eval()

#         # Update the linear layer to project from 1024 (BERT large) to 1024
#         # self.projection_layer = nn.Linear(1024, 1024)  # 1024 from BERT large
    
#     def bert_embedding(self, texts: Union[str, List[str]], normalize: bool = True) -> List[List[float]]:
#         if isinstance(texts, str):
#             texts = [texts]
#         try:
#             # Tokenize the input texts
#             inputs = self.bert_tokenizer(texts, padding=True, truncation=True, return_tensors='pt', max_length=512)
            
#             with torch.no_grad():
#                 # Get BERT model outputs
#                 outputs = self.bert_model(**inputs)
#                 # Use the embedding of the [CLS] token
#                 embeddings = outputs.last_hidden_state[:, 0, :]  # Shape: (batch_size, 1024)

#                 # # Apply projection to match the 1024 dimension
#                 # projected_embeddings = self.projection_layer(embeddings)  # Shape: (batch_size, 1024)

#             # Convert to a list and optionally normalize the embeddings
#             embedding_list = embeddings.numpy().tolist()

#             if normalize:
#                 embedding_list = [
#                     [float(val / torch.norm(torch.tensor(emb))) for val in emb] 
#                     for emb in embedding_list
#                 ]
            
#             return embedding_list
        
#         except Exception as e:
#             print(f"BERT embedding error: {e}")
#             raise


# # import tensorflow as tf
# # import tensorflow_hub as hub
# # import numpy as np
# # from typing import List, Union

# # class EmbeddingService:
# #     def __init__(self, model_url='https://tfhub.dev/google/bert_uncased_L-24_H-1024_A-16/3'):  
# #         # Default: BERT Large (24 layers, 1024 hidden units, 16 attention heads)
# #         self.bert_model = hub.load(model_url)
# #         self.tokenizer = hub.load('https://tfhub.dev/tensorflow/bert_en_uncased_preprocess/3')  # Preprocessing for BERT

# #     def bert_embedding(self, texts: Union[str, List[str]], normalize: bool = True) -> List[List[float]]:
# #         if isinstance(texts, str):
# #             texts = [texts]
# #         try:
# #             # Preprocess the input text using the BERT tokenizer
# #             inputs = self.tokenizer(texts)  # Preprocessing includes tokenization, padding, etc.

# #             # Get embeddings from the BERT model
# #             outputs = self.bert_model(inputs)  
# #             embeddings = outputs['pooled_output']  # Use [CLS] token embedding for classification tasks
            
# #             # Convert to numpy array
# #             embedding_list = embeddings.numpy()

# #             if normalize:
# #                 # Normalize each embedding vector
# #                 embedding_list = [
# #                     (emb / np.linalg.norm(emb)).tolist() for emb in embedding_list
# #                 ]

# #             return embedding_list

# #         except Exception as e:
# #             print(f"BERT embedding error: {e}")
# #             raise

# # pip install tensorflow tensorflow-hub tensorflow-text
