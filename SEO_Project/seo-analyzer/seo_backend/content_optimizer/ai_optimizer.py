
from django.conf import settings
def optimize_content(title,meta,content,keyword):
    if not settings.OPENAI_API_KEY:
        return None
    from openai import OpenAI
    client=OpenAI(api_key=settings.OPENAI_API_KEY)
    prompt=f"""Improve this webpage SEO.
Keyword: {keyword}
Title: {title}
Meta: {meta}
Content: {content}
Return an optimized title, meta description and improved content."""
    response=client.chat.completions.create(model="gpt-4o-mini",messages=[{"role":"user","content":prompt}])
    return response.choices[0].message.content
