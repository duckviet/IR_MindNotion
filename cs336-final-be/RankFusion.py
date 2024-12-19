import numpy as np
class RankFusion:
    def normalize(self, results_1, results_2):
        # Extract scores from both result sets
        scores_1 = [result['score'] for result in results_1]
        scores_2 = [result['score'] for result in results_2]
        
        # Combine scores to find min and max
        all_scores = scores_1 + scores_2
        min_score = np.min(all_scores)
        max_score = np.max(all_scores)
        
        # Normalize results
        normalized_results_1 = []
        for result in results_1:
            normalized_result = result.copy()
            normalized_result['score'] = (result['score'] - min_score) / (max_score - min_score)
            normalized_results_1.append(normalized_result)
        
        normalized_results_2 = []
        for result in results_2:
            normalized_result = result.copy()
            normalized_result['score'] = (result['score'] - min_score) / (max_score - min_score)
            normalized_results_2.append(normalized_result)
        
        return normalized_results_1, normalized_results_2


    def comb_sum(self, results_1, results_2):

        # Create dictionaries for faster lookup
        # results_dict_1 = {result['id']: result for result in results_1}
        results_dict_2 = {result['id']: result for result in results_2}
        
        # Combine results
        combined_results = []
        for result in results_1:
            doc_id = result['id']
            
            # Get score from second result set, default to 0 if not found
            score_2 = results_dict_2.get(doc_id, {'score': 0})['score']
            
            # Combine scores
            combined_score = result['score'] + score_2
            
            # Create result in the specified format
            combined_results.append({
                "id": result['id'],
                "score": combined_score,
                "metadata": result['metadata']
            })
        
        # Sort results by combined score in descending order
        return sorted(combined_results, key=lambda x: x['score'], reverse=True)
    
    def comb_mnz(self, results_1, results_2):
    
        # Create dictionaries for faster lookup
        # results_dict_1 = {result['id']: result for result in results_1}
        results_dict_2 = {result['id']: result for result in results_2}
        
        # Combine results
        combined_results = []
        for result in results_1:
            doc_id = result['id']
            
            # Get score from second result set, default to 0 if not found
            score_2 = results_dict_2.get(doc_id, {'score': 0})['score']
            
            # Take maximum score
            if(score_2==0):
                combined_score = result['score']
            else:  
                combined_score = 2*(result['score'] + score_2)
            
            # Create result in the specified format
            combined_results.append({
                "id": result['id'],
                "score": combined_score,
                "metadata": result['metadata']
            })
        
        # Sort results by combined score in descending order
        return sorted(combined_results, key=lambda x: x['score'], reverse=True)