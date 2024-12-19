from bs4 import BeautifulSoup as bs
import requests

class ScrapeWebContent:
    def __init__(self):
        pass
    def extract_article_info(self,url):
        Page = requests.get(url)
        souping = bs(Page.content, 'html.parser')

        title = souping.find('title').text
        metadata_description = souping.find('meta', {'name': 'description'})
        metadata_description_content = metadata_description.get('content') if metadata_description else "No description available"
        description = souping.find('div', {'class': 'article-content__body'}).find('p').text
        ps = [p.text for p in souping.find('div', {'class': 'article-content__body'}).findAll('p') if p.text.strip()]
        author_info = souping.find('div', class_='post-author__info')
        author_name = author_info.find('a', class_='post-author__name').text.strip()
        author_username = author_info.find('span', class_='text-muted').text.strip()
        stats = author_info.find_all('span', class_='stats-item')
        reputation = stats[0].text.strip()
        followers = stats[1].text.strip()
        posts = stats[2].text.strip()

        print(title)

        return {
            'title': title,
            'metadata_description': metadata_description_content,
            'description': description,
            'author_name': author_name,
            'author_username': author_username,
            'reputation': reputation,
            'followers': followers,
            'posts': posts,
            'url':url,
            'paragraphs': ps
        }

    def get_articles(self,url):
        href = url
        Page = requests.get(href)
        souping = bs(Page.content, 'html.parser')
        scrapy_data = []

        # Find all divs with the class 'search-item__title'
        search_items = souping.findAll('div', {'class': 'search-item__title'})

        # Print the result

        for item in search_items:
            scrapy_data.append(self.extract_article_info(f"https://viblo.asia{item.find('a', {'class': 'link'}).get('href')}"))

        return scrapy_data