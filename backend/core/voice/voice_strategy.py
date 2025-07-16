from abc import ABC, abstractmethod


class VoiceStrategy(ABC):
    @abstractmethod
    def set_voice(self, engine):
        pass
