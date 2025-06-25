/* eslint-disable */
/* @ts-nocheck */

"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Mic,
  Volume2,
  User,
  Bot,
  Loader2,
  X,
} from "lucide-react";
import type { VoiceAssistantMessage } from "@/types";

interface AIAssistantContentProps {
  userId: string;
}

export function AIAssistantContent({ userId }: AIAssistantContentProps) {
  const [messages, setMessages] = useState<VoiceAssistantMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI healthcare assistant. How can I help you today?",
      timestamp: new Date(),
      language: "ENGLISH",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<
    "ENGLISH" | "HINDI" | "GUJARATI"
  >("ENGLISH");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: VoiceAssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          language: selectedLanguage,
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: VoiceAssistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          language: selectedLanguage,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: VoiceAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
        language: selectedLanguage,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang =
        selectedLanguage === "HINDI"
          ? "hi-IN"
          : selectedLanguage === "GUJARATI"
          ? "gu-IN"
          : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser");
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        selectedLanguage === "HINDI"
          ? "hi-IN"
          : selectedLanguage === "GUJARATI"
          ? "gu-IN"
          : "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: getLanguageGreeting(),
        timestamp: new Date(),
        language: selectedLanguage,
      },
    ]);
  };

  const getLanguageGreeting = () => {
    switch (selectedLanguage) {
      case "HINDI":
        return "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?";
      case "GUJARATI":
        return "નમસ્તે! હું તમારો AI આરોગ્ય સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?";
      default:
        return "Hello! I'm your AI healthcare assistant. How can I help you today?";
    }
  };

  const handleLanguageChange = (
    newLanguage: "ENGLISH" | "HINDI" | "GUJARATI"
  ) => {
    setSelectedLanguage(newLanguage);
    // Update the initial greeting message
    setMessages((prev) =>
      prev.map((msg, index) =>
        index === 0 && msg.role === "assistant"
          ? { ...msg, content: getLanguageGreeting(), language: newLanguage }
          : msg
      )
    );
  };

  const quickQuestions = [
    "When is my next appointment?",
    "What medications should I take today?",
    "How is my recovery progress?",
    "What are the side effects of my medications?",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Language Selection - Sticky Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              AI Healthcare Assistant
            </CardTitle>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium whitespace-nowrap">
                Language:
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENGLISH">🇺🇸 English</SelectItem>
                  <SelectItem value="HINDI">🇮🇳 हिंदी</SelectItem>
                  <SelectItem value="GUJARATI">🇮🇳 ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={clearChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Interface - Fixed Height Container */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
          {/* Messages Area with Scroll */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                        message.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 break-words ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 mt-1 ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              isSpeaking
                                ? stopSpeaking()
                                : handleTextToSpeech(message.content)
                            }
                          >
                            {isSpeaking ? (
                              <X className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-muted">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Quick Questions - Only show when no conversation */}
          {messages.length <= 1 && (
            <div className="px-4 pb-4 border-t flex-shrink-0">
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Quick questions:
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => setInputMessage(question)}
                  >
                    <span className="text-xs leading-relaxed">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Type your message in ${selectedLanguage.toLowerCase()}...`}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="pr-12 min-h-[44px]"
                  maxLength={500}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {inputMessage.length}/500
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                disabled={isLoading || isListening}
                className={`flex-shrink-0 h-[44px] w-[44px] ${
                  isListening ? "bg-red-50 border-red-200" : ""
                }`}
              >
                <Mic
                  className={`h-4 w-4 ${
                    isListening ? "text-red-500 animate-pulse" : ""
                  }`}
                />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="flex-shrink-0 h-[44px] px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isListening && (
              <div className="mt-2 text-center">
                <span className="text-sm text-red-500 animate-pulse">
                  🎤 Listening...
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
