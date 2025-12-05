import os

from services.ai.providers.gemini import GeminiStrategy
from services.ai.providers.openai import OpenAIStrategy


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
