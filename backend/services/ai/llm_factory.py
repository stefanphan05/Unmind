import os

from dotenv import load_dotenv
# from .gemini_strategy import GeminiStrategy
from .openai_strategy import OpenAIStrategy


def llm_factory():
    load_dotenv()

    # provider = os.getenv("LLM_PROVIDER", "openai").lower()
    # if provider == "gemini":
    #     return GeminiStrategy()
    # elif provider == "openai":
    #     return OpenAIStrategy()
    # else:
    #     raise ValueError("Unsupported LLM provider")

    provider = os.getenv("LLM_PROVIDER", "openai").lower()

    if provider == "openai":
        return OpenAIStrategy()
    else:
        raise ValueError("Unsupported LLM provider")
