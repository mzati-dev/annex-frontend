'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { chatApiService } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/api.constants';
import { useAppContext } from '@/context/AppContext';
import { Conversation, Message, UserProfile } from '@/types';
import { format, parseISO, isToday } from 'date-fns';


const formatTimestamp = (isoDate: string) => {
    try {
        const date = parseISO(isoDate);
        if (isToday(date)) {
            return format(date, 'p');
        }
        return format(date, 'MMM d');
    } catch (error) {
        return '...';
    }
};

export default function ChatScreen({ onClose }: { onClose: () => void }) {

    const { user, activeChatId, setUnreadMessageCount } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // useEffect(() => {
    //     if (!user) return;
    //     const newSocket = io(API_BASE_URL);
    //     setSocket(newSocket);
    //     newSocket.emit('joinRoom', user.id);
    //     newSocket.on('newMessage', (incomingMessage: Message) => {
    //         setMessages(prev => {
    //             const conversationId = incomingMessage.conversation.id;
    //             const existingMessages = prev[conversationId] || [];
    //             if (existingMessages.some(msg => msg.id === incomingMessage.id)) {
    //                 return prev;
    //             }
    //             return {
    //                 ...prev,
    //                 [conversationId]: [...existingMessages, incomingMessage],
    //             };
    //         });
    //     });

    //     return () => {
    //         newSocket.off('newMessage');
    //         newSocket.disconnect();
    //     };
    // }, [user]);


    // REPLACE your old socket useEffect with this new one
    useEffect(() => {
        if (!user) return;
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);
        newSocket.emit('joinRoom', user.id);

        newSocket.on('newMessage', (incomingMessage: Message) => {
            // This part, which adds the new message to the chat window, is correct.
            setMessages(prev => {
                const conversationId = incomingMessage.conversation.id;
                const existingMessages = prev[conversationId] || [];
                if (existingMessages.some(msg => msg.id === incomingMessage.id)) {
                    return prev;
                }
                return {
                    ...prev,
                    [conversationId]: [...existingMessages, incomingMessage],
                };
            });

            // V V V V V THIS IS THE NEW LOGIC V V V V V
            // Check if the incoming message is for the chat that is currently open.
            if (incomingMessage.conversation.id !== activeConversation?.id) {
                // If the message is for a DIFFERENT chat, increase the global counter by 1.
                setUnreadMessageCount(prevCount => prevCount + 1);
            } else {
                // If the user IS currently viewing this chat, we tell the backend
                // to mark the message as read immediately.
                chatApiService.markConversationAsRead(incomingMessage.conversation.id);
            }
            // ^ ^ ^ ^ ^ END OF NEW LOGIC ^ ^ ^ ^ ^
        });

        return () => {
            newSocket.off('newMessage');
            newSocket.disconnect();
        };
        // This dependency array is CRUCIAL. It makes sure the `if` statement
        // always knows which conversation is currently active.
    }, [user, activeConversation, setUnreadMessageCount]);


    useEffect(() => {
        if (!user) return;
        const fetchAndSetData = async () => {
            setIsLoading(true);
            try {
                const convos = await chatApiService.getConversations();
                setConversations(convos);


                if (activeChatId) {

                    const preselectedConversation = convos.find(c =>
                        c.participants.some(p => p.id === activeChatId)
                    );

                    if (preselectedConversation) {

                        await handleSelectConversation(preselectedConversation);
                    }
                } else if (convos.length > 0 && !activeConversation) {

                    await handleSelectConversation(convos[0]);
                }


            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndSetData();
    }, [user, activeChatId]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversation]);


    // const handleSelectConversation = async (conv: Conversation) => {
    //     setActiveConversation(conv);
    //     if (!messages[conv.id]) {
    //         try {
    //             const history = await chatApiService.getMessages(conv.id);
    //             setMessages(prev => ({ ...prev, [conv.id]: history }));
    //         } catch (error) {
    //             console.error(`Failed to fetch messages for conversation ${conv.id}:`, error);
    //         }
    //     }
    // };

    // REPLACE your old function with this new one
    const handleSelectConversation = async (conv: Conversation) => {
        setActiveConversation(conv);

        // V V V V V THIS IS THE NEW LOGIC V V V V V
        // First, check if the conversation being opened has an unread count greater than zero.
        if (conv.unreadCount && conv.unreadCount > 0) {
            try {
                // 1. Tell the backend to mark all messages in this chat as "read".
                await chatApiService.markConversationAsRead(conv.id);

                // 2. Subtract this chat's unread count from the GLOBAL total.
                //    This immediately updates the red badge in the Header.
                setUnreadMessageCount(prevCount => Math.max(0, prevCount - conv.unreadCount));

                // 3. Update the local conversation list to set this chat's count to 0.
                //    This makes the small number badge on the chat list disappear.
                setConversations(prevConvos => prevConvos.map(c =>
                    c.id === conv.id ? { ...c, unreadCount: 0 } : c
                ));
            } catch (error) {
                console.error("Failed to mark conversation as read:", error);
            }
        }
        // ^ ^ ^ ^ ^ END OF NEW LOGIC ^ ^ ^ ^ ^

        // This part of your original code for fetching messages stays the same.
        if (!messages[conv.id]) {
            try {
                const history = await chatApiService.getMessages(conv.id);
                setMessages(prev => ({ ...prev, [conv.id]: history }));
            } catch (error) {
                console.error(`Failed to fetch messages for conversation ${conv.id}:`, error);
            }
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeConversation || !socket || !user) return;
        socket.emit('sendMessage', {
            authorId: user.id,
            conversationId: activeConversation.id,
            content: newMessage,
        });
        setNewMessage('');
    };

    const getOtherParticipant = (conv: Conversation): UserProfile | undefined => {
        if (!user) return undefined;
        return conv.participants.find(p => p.id !== user.id);
    };

    const activeConvMessages = activeConversation ? messages[activeConversation.id] || [] : [];
    const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;


    return (
        // <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">
        <div className="fixed bottom-5 right-5 w-[700px] h-[500px] max-h-[calc(100vh-40px)] bg-slate-900 text-white flex z-50 font-sans rounded-lg shadow-2xl overflow-hidden border border-slate-700">
            <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>

                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-xl font-bold">Messages</h1>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </header>
                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search conversations..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {isLoading && <p className="text-center text-slate-400 p-4">Loading chats...</p>}
                    {!isLoading && conversations.map(conv => {
                        const otherParticipant = getOtherParticipant(conv);
                        if (!otherParticipant) return null;
                        return (
                            // REPLACE THE CONTENT OF THIS DIV
                            <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversation?.id === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
                                <img src={otherParticipant.profileImageUrl || `https://ui-avatars.com/api/?name=${otherParticipant.name.replace(' ', '+')}&background=2563eb&color=fff&rounded=true`} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />

                                {/* V V V V V THIS IS THE UPDATED PART V V V V V */}
                                <div className="ml-4 flex-grow overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
                                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTimestamp(conv.updatedAt)}</span>
                                    </div>
                                    <div className="flex justify-between items-start mt-1">
                                        <p className="text-sm text-slate-400 truncate">
                                            {/* You can add last message preview here later */}
                                        </p>
                                        {/* This logic displays the badge only if the count is > 0 */}
                                        {conv.unreadCount > 0 && (
                                            <span className="flex-shrink-0 ml-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* ^ ^ ^ ^ ^ END OF THE UPDATED PART ^ ^ ^ ^ ^ */}

                            </div>
                        )
                    })}
                    {/* {!isLoading && conversations.map(conv => {
                        const otherParticipant = getOtherParticipant(conv);
                        if (!otherParticipant) return null;
                        return (
                            <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversation?.id === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
                                <img src={otherParticipant.profileImageUrl || `https://ui-avatars.com/api/?name=${otherParticipant.name.replace(' ', '+')}&background=2563eb&color=fff&rounded=true`} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="ml-4 flex-grow overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
                                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTimestamp(conv.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })} */}
                </div>
            </aside>
            <main className={`flex-1 flex-col ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation && otherUser ? (
                    <>
                        <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center">
                                <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversation(null)}><ArrowLeft size={20} /></button>
                                <img src={otherUser.profileImageUrl || `https://ui-avatars.com/api/?name=${otherUser.name.replace(' ', '+')}`} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                <div><h2 className="font-semibold text-lg">{otherUser.name}</h2></div>
                            </div>
                            <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
                        </header>
                        <div className="flex-grow p-6 overflow-y-auto bg-slate-900">
                            <div className="space-y-6">
                                {activeConvMessages.map(msg => (
                                    <div key={msg.id} className={`flex items-end gap-3 ${msg.author.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.author.id !== user?.id && <img src={msg.author.profileImageUrl || `https://ui-avatars.com/api/?name=${msg.author.name.replace(' ', '+')}`} alt={msg.author.name} className="w-8 h-8 rounded-full self-start" />}
                                        <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.author.id === user?.id ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs text-slate-400/80 text-right mt-1">{formatTimestamp(msg.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
                            <div className="flex items-center bg-slate-700 rounded-lg px-2">
                                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" />
                                <button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg>
                        <h2 className="text-xl font-medium">Select a conversation</h2>
                        <p className="text-sm">Choose from your existing conversations to start chatting.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

