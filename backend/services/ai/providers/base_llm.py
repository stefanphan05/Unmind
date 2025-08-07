from abc import ABC, abstractmethod
from typing import List, Dict


class LLMStrategy(ABC):
    @abstractmethod
    def generate_response(self, messages: List[Dict[str, str]]) -> str:
        pass

    @abstractmethod
    def format_messages(self, user_input: str, load_history: bool, system_prompt: str, email: str) -> any:
        pass
