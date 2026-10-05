def generate_content_suggestion(title, meta, content, keyword):
    return {
        "title": f"{title} | Best {keyword}",
        "meta": f"{meta} - Optimized for {keyword}",
        "content": f"{content}\n\nThis content is optimized for {keyword}."
    }
