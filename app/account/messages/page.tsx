"use client";

import { useState } from "react";
import { Avatar } from "@/src/components/atoms/Avatar";
import { cn, formatDate } from "@/src/lib/utils";
import { HiMagnifyingGlass, HiPaperAirplane, HiPhoto, HiFaceSmile, HiChevronLeft, HiOutlineArrowPath } from "react-icons/hi2";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  context: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Maria Tebwa",
    participantAvatar: "",
    context: "Re: Tebwa Shell Necklace",
    lastMessage: "Yes, I can add custom colors to the necklace. Would you like me to...",
    lastMessageTime: "10 min ago",
    unread: true,
    messages: [
      { id: "m1", senderId: "them", text: "Thank you for your order! I'll start crafting it tomorrow.", timestamp: "2026-07-21T10:00:00" },
      { id: "m2", senderId: "me", text: "Can I request a specific color combination?", timestamp: "2026-07-21T10:05:00" },
      { id: "m3", senderId: "them", text: "Yes, I can add custom colors to the necklace. Would you like me to use ocean blue and white?", timestamp: "2026-07-21T10:10:00" },
    ],
  },
  {
    id: "conv-2",
    participantName: "Bwere Eco Retreats",
    participantAvatar: "",
    context: "Re: Eco Lagoon Retreat booking",
    lastMessage: "Your check-in is confirmed for August 15th. We'll have...",
    lastMessageTime: "Yesterday",
    unread: false,
    messages: [
      { id: "m4", senderId: "them", text: "Your check-in is confirmed for August 15th. We'll have a guide meet you at the airport.", timestamp: "2026-07-20T14:00:00" },
      { id: "m5", senderId: "me", text: "Perfect, thank you! Do you offer snorkeling gear rental?", timestamp: "2026-07-20T14:30:00" },
      { id: "m6", senderId: "them", text: "Yes, complimentary snorkeling gear is included with your stay.", timestamp: "2026-07-20T15:00:00" },
    ],
  },
  {
    id: "conv-3",
    participantName: "Tione Karanga",
    participantAvatar: "",
    context: "Re: Maneaba Spirit Carving",
    lastMessage: "The carving is finished and ready for shipping. I'll send tracking...",
    lastMessageTime: "2 days ago",
    unread: false,
    messages: [
      { id: "m7", senderId: "them", text: "The carving is finished and ready for shipping. I'll send tracking details once it's dispatched.", timestamp: "2026-07-19T09:00:00" },
    ],
  },
  {
    id: "conv-4",
    participantName: "Anere Homestays",
    participantAvatar: "",
    context: "Re: Oceanview Villa inquiry",
    lastMessage: "Yes, the villa is available for your requested dates. Would...",
    lastMessageTime: "1 week ago",
    unread: false,
    messages: [
      { id: "m8", senderId: "them", text: "Yes, the villa is available for your requested dates. Would you like to proceed with the booking?", timestamp: "2026-07-15T11:00:00" },
      { id: "m9", senderId: "me", text: "Let me confirm with my group and get back to you.", timestamp: "2026-07-15T12:00:00" },
    ],
  },
];

function ConversationList({
  conversations,
  activeConvId,
  search,
  onSearchChange,
  onSelect,
}: {
  conversations: Conversation[];
  activeConvId: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="relative border-b border-[#DDDDDD] p-3">
        <HiMagnifyingGlass className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search conversations..."
          className="w-full rounded-lg border border-[#DDDDDD] bg-white py-2 pl-10 pr-4 text-sm text-[#222222] placeholder:text-[#717171] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-[#717171]">
            No conversations found
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-[#DDDDDD] p-4 text-left transition-colors hover:bg-[#F7F7F7]",
                activeConvId === conv.id && "bg-[#F7F7F7]"
              )}
            >
              <Avatar name={conv.participantName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", conv.unread ? "font-bold text-[#222222]" : "font-medium text-[#222222]")}>
                    {conv.participantName}
                  </span>
                  <span className="text-xs text-[#717171]">{conv.lastMessageTime}</span>
                </div>
                <p className="truncate text-xs text-[#717171]">{conv.context}</p>
                <p className={cn("mt-0.5 truncate text-xs", conv.unread ? "font-semibold text-[#222222]" : "text-[#717171]")}>
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#FF385C]" />}
            </button>
          ))
        )}
      </div>
    </>
  );
}

function ChatView({
  conversation,
  messageInput,
  isTyping,
  onMessageChange,
  onSend,
  onBack,
}: {
  conversation: Conversation;
  messageInput: string;
  isTyping: boolean;
  onMessageChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-[#DDDDDD] px-4 py-4 md:px-6">
        <button onClick={onBack} className="mr-1 text-[#717171] hover:text-[#222222] md:hidden">
          <HiChevronLeft className="h-5 w-5" />
        </button>
        <Avatar name={conversation.participantName} size="md" />
        <div>
          <h3 className="text-sm font-bold text-[#222222]">{conversation.participantName}</h3>
          <p className="text-xs text-[#717171]">{conversation.context}</p>
        </div>
        <span className="ml-auto text-xs text-green-600">Usually replies in 1 hour</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3">
          {conversation.messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
                    isMe
                      ? "bg-[#FF385C] text-white"
                      : "bg-[#F7F7F7] text-[#222222]"
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn("mt-1 text-right text-xs", isMe ? "text-white/70" : "text-[#717171]")}>
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-[#F7F7F7] px-4 py-3">
                  <span className="text-xs text-[#717171]">{conversation.participantName} is typing</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#717171] [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#717171] [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#717171]" />
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="border-t border-[#DDDDDD] px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button className="text-[#717171] hover:text-[#222222]">
            <HiPhoto className="h-5 w-5" />
          </button>
          <button className="text-[#717171] hover:text-[#222222]">
            <HiFaceSmile className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input
              value={messageInput}
              onChange={(e) => onMessageChange(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "Waiting for response..." : "Type a message..."}
              className="w-full rounded-full border border-[#DDDDDD] bg-[#F7F7F7] px-4 py-2.5 pr-12 text-sm text-[#222222] placeholder:text-[#717171] transition-colors focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222] disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && messageInput.trim() && !isTyping) {
                  onSend();
                }
              }}
            />
            <button
              onClick={onSend}
              disabled={isTyping || !messageInput.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#FF385C] p-1.5 text-white transition-colors hover:bg-[#E31C5F] disabled:bg-[#DDDDDD] disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <HiOutlineArrowPath className="h-4 w-4 animate-spin text-white" />
              ) : (
                <HiPaperAirplane className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text || !activeConvId) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConvId
          ? {
              ...conv,
              messages: [...conv.messages, userMsg],
              lastMessage: text,
              lastMessageTime: "Just now",
              unread: false,
            }
          : conv
      )
    );
    setMessageInput("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = `Thanks for your message! I've received your note about "${text.slice(0, 40)}" and will get back to you shortly.`;
      const replyMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: "them",
        text: replyText,
        timestamp: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConvId
            ? {
                ...conv,
                messages: [...conv.messages, replyMsg],
                lastMessage: replyText,
                lastMessageTime: "Just now",
                unread: true,
              }
            : conv
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const showList = !activeConvId;
  const showChat = !!activeConvId;

  return (
      <div className="flex h-[calc(100vh-200px)] min-h-[500px] overflow-hidden rounded-xl border border-[#DDDDDD]">
        <aside
          className={cn(
            "flex w-full flex-col border-r border-[#DDDDDD] md:w-80",
            showChat && "hidden md:flex"
          )}
        >
          <ConversationList
            conversations={filteredConversations}
            activeConvId={activeConvId}
            search={search}
            onSearchChange={setSearch}
            onSelect={setActiveConvId}
          />
        </aside>

        <main
          className={cn(
            "flex flex-1 flex-col",
            showList && "hidden md:flex"
          )}
        >
          {activeConv ? (
            <ChatView
              conversation={activeConv}
              messageInput={messageInput}
              isTyping={isTyping}
              onMessageChange={setMessageInput}
              onSend={handleSendMessage}
              onBack={() => setActiveConvId(null)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <HiFaceSmile className="mx-auto mb-2 h-12 w-12 text-[#DDDDDD]" />
                <p className="text-base font-medium text-[#717171]">Select a conversation</p>
                <p className="text-sm text-[#717171]">Choose a conversation from the left to start chatting</p>
              </div>
            </div>
          )}
        </main>
      </div>
  );
}