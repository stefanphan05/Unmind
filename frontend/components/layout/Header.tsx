"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FaAngleDown, FaCheck } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { LogOut, Menu, Sparkles, Volume2 } from "lucide-react";
import { getStoredToken } from "@/lib/utils/authToken";
import { ApiError } from "next/dist/server/api-utils";

import { removeAllMessages } from "@/lib/api/chat";
import { useAuth } from "@/providers/auth-provider";
import {
  CACHE_KEYS,
  STALE_MS,
  getCacheEntry,
  isCacheFresh,
  setCacheEntry,
} from "@/lib/cache/apiCache";
import {
  CurrentVoiceResponse,
  getCurrentVoice,
  switchVoice,
} from "@/lib/api/voice";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  onError: (error: ApiError) => void;
  onClearMessages: () => void;
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  onError,
  onClearMessages,
  selectedTone,
  onToneChange,
}: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  const params = useParams();
  const therapySessionId = Number(params?.therapySessionId);

  const headerRef = useRef<HTMLElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [toneMenuOpen, setToneMenuOpen] = useState(false);
  const [voiceMenuOpen, setVoiceMenuOpen] = useState(false);

  const [currentVoice, setCurrentVoice] = useState<string>(() => {
    const cached = getCacheEntry<CurrentVoiceResponse>(CACHE_KEYS.voice);
    return cached?.data.current_voice ?? "sarah";
  });
  const [availableVoices, setAvailableVoices] = useState<string[]>(() => {
    const cached = getCacheEntry<CurrentVoiceResponse>(CACHE_KEYS.voice);
    return cached?.data.available_voices ?? [];
  });
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);

  const availableTones = [
    "fun",
    "angry",
    "boring",
    "aggressive",
    "compassionate",
  ];

  const userInitial = (
    user?.username?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase();

  const closeAllMenus = () => {
    setMenuOpen(false);
    setToneMenuOpen(false);
    setVoiceMenuOpen(false);
  };

  useEffect(() => {
    const fetchCurrentVoice = async () => {
      if (isCacheFresh(CACHE_KEYS.voice, STALE_MS.voice)) return;

      const token = getStoredToken();
      if (!token) return;

      const voiceData = await getCurrentVoice(token, onError);
      if (voiceData) {
        setCacheEntry(CACHE_KEYS.voice, voiceData);
        setCurrentVoice(voiceData.current_voice);
        setAvailableVoices(voiceData.available_voices);
      }
    };

    fetchCurrentVoice();
  }, [onError]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSignOut = () => {
    closeAllMenus();
    router.push("/signin");
    signOut();
  };

  const handleDeleteMessages = async () => {
    const token = getStoredToken();
    if (token) {
      await removeAllMessages(token, therapySessionId, onError);
    }

    closeAllMenus();
    onClearMessages();
  };

  const handleVoiceSwitch = async (voiceName: string) => {
    if (voiceName === currentVoice) {
      setVoiceMenuOpen(false);
      return;
    }

    const token = getStoredToken();
    if (token) {
      setIsLoadingVoice(true);
      const response = await switchVoice(token, voiceName, onError);

      if (response && response.status === "success") {
        setCurrentVoice(response.current_voice);
        const cached = getCacheEntry<CurrentVoiceResponse>(CACHE_KEYS.voice);
        setCacheEntry(CACHE_KEYS.voice, {
          status: response.status,
          current_voice: response.current_voice,
          voice_id: response.voice_id,
          available_voices: cached?.data.available_voices ?? availableVoices,
        });
      }
      setIsLoadingVoice(false);
    }

    setVoiceMenuOpen(false);
  };

  const capitalizeVoice = (voice: string) => {
    return voice.charAt(0).toUpperCase() + voice.slice(1);
  };

  const handleToneSelect = (tone: string) => {
    setToneMenuOpen(false);
    onToneChange(tone);
  };

  return (
    <header className="chat-top-bar" ref={headerRef}>
      <div className="chat-top-bar__inner">
        <div className="chat-top-bar__start">
          <button
            type="button"
            className={`chat-sessions-btn ${
              isSidebarOpen ? "chat-sessions-btn--active" : ""
            }`}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Close history" : "Open history"}
            aria-expanded={isSidebarOpen}
          >
            <Menu className="chat-sessions-btn__icon" strokeWidth={1.75} />
            <span className="chat-sessions-btn__label">History</span>
          </button>

          <span className="chat-top-bar__wordmark font-display">Unmind</span>
        </div>

        {isAuthenticated && (
          <div className="chat-top-bar__end">
            <div className="chat-top-bar__tone-wrap">
              <button
                type="button"
                className={`chat-header__tone-pill ${
                  toneMenuOpen ? "chat-header__tone-pill--open" : ""
                }`}
                onClick={() => {
                  setToneMenuOpen((prev) => !prev);
                  setMenuOpen(false);
                  setVoiceMenuOpen(false);
                }}
                aria-expanded={toneMenuOpen}
                aria-haspopup="listbox"
              >
                <Sparkles
                  className="chat-header__tone-icon"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span>{capitalizeVoice(selectedTone)}</span>
                <FaAngleDown className="chat-header__chevron" />
              </button>
              {toneMenuOpen && (
                <div className="chat-header__dropdown chat-header__dropdown--tone">
                  <p className="chat-header__dropdown-heading">Mood</p>
                  <ul>
                    {availableTones.map((tone) => (
                      <li key={tone}>
                        <button
                          type="button"
                          className={`chat-header__dropdown-option ${
                            selectedTone === tone
                              ? "chat-header__dropdown-option--selected"
                              : ""
                          }`}
                          onClick={() => handleToneSelect(tone)}
                        >
                          <span>{capitalizeVoice(tone)}</span>
                          {selectedTone === tone && (
                            <FaCheck className="chat-header__check" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="chat-top-bar__menu-wrap">
              <button
                type="button"
                className="chat-header__avatar-btn"
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setToneMenuOpen(false);
                }}
                aria-label="Account and settings"
                aria-expanded={menuOpen}
              >
                <span className="chat-header__avatar font-display">
                  {userInitial}
                </span>
              </button>

              {menuOpen && (
                <div className="chat-header__dropdown chat-header__dropdown--account">
                  <div className="chat-header__account-card">
                    <span className="chat-header__account-name font-display">
                      {user?.username || "Guest"}
                    </span>
                    {user?.email && (
                      <span className="chat-header__account-email">
                        {user.email}
                      </span>
                    )}
                  </div>

                  <div className="chat-header__dropdown-section">
                    <button
                      type="button"
                      className="chat-header__dropdown-row"
                      onClick={() => {
                        setVoiceMenuOpen((prev) => !prev);
                      }}
                    >
                      <Volume2
                        className="chat-header__row-icon"
                        strokeWidth={1.75}
                      />
                      <span>Voice · {capitalizeVoice(currentVoice)}</span>
                      <FaAngleDown className="chat-header__chevron chat-header__chevron--sm" />
                    </button>
                    {voiceMenuOpen && (
                      <ul className="chat-header__sublist">
                        {availableVoices.map((voice) => (
                          <li key={voice}>
                            <button
                              type="button"
                              className={`chat-header__dropdown-option ${
                                currentVoice === voice
                                  ? "chat-header__dropdown-option--selected"
                                  : ""
                              } ${isLoadingVoice ? "opacity-50 pointer-events-none" : ""}`}
                              onClick={() => handleVoiceSwitch(voice)}
                            >
                              <span>{capitalizeVoice(voice)}</span>
                              {currentVoice === voice && (
                                <FaCheck className="chat-header__check" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="chat-header__dropdown-divider" />

                  <button
                    type="button"
                    className="chat-header__dropdown-row chat-header__dropdown-row--danger"
                    onClick={handleDeleteMessages}
                  >
                    <FiTrash2 className="chat-header__row-icon" />
                    <span>Clear this conversation</span>
                  </button>

                  <div className="chat-header__dropdown-divider" />

                  <button
                    type="button"
                    className="chat-header__dropdown-row chat-header__dropdown-row--danger"
                    onClick={handleSignOut}
                  >
                    <LogOut className="chat-header__row-icon" strokeWidth={1.75} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
