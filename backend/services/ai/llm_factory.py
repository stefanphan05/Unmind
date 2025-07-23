import os

from dotenv import load_dotenv
from .gemini_strategy import GeminiStrategy
from .openai_strategy import OpenAIStrategy


def llm_factory():
    provider = os.getenv("LLM_PROVIDER", "gemini").lower()
    if provider == "gemini":
        print("using gemini")
        return GeminiStrategy()
    elif provider == "openai":
        print("Using open ai")
        return OpenAIStrategy()
    else:
        raise ValueError("Unsupported LLM provider")
