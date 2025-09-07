'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { chatApiService } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/api.constants';
import { useAppContext } from '@/context/AppContext';
import { Conversation, Message, UserProfile } from '@/types';
import { format, parseISO, isToday } from 'date-fns';

// Helper function to format timestamps for display
const formatTimestamp = (isoDate: string) => {
    try {
        const date = parseISO(isoDate);
        if (isToday(date)) {
            return format(date, 'p'); // '4:30 PM'
        }
        return format(date, 'MMM d'); // 'Sep 6'
    } catch (error) {
        return '...'; // Fallback for invalid dates
    }
};

export default function ChatScreen({ onClose }: { onClose: () => void }) {
    // --- CHANGE 1: GET 'activeChatId' FROM THE CONTEXT ---
    // This ID is the TUTOR'S ID that you want to chat with.
    const { user, activeChatId } = useAppContext();

    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- EFFECT 1: MANAGE WEBSOCKET CONNECTION (No changes needed here) ---
    useEffect(() => {
        if (!user) return;
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);
        newSocket.emit('joinRoom', user.id);
        newSocket.on('newMessage', (incomingMessage: Message) => {
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
        });

        return () => {
            newSocket.off('newMessage');
            newSocket.disconnect();
        };
    }, [user]);

    // --- EFFECT 2: FETCH INITIAL DATA AND SELECT ACTIVE CHAT ---
    useEffect(() => {
        if (!user) return;
        const fetchAndSetData = async () => {
            setIsLoading(true);
            try {
                const convos = await chatApiService.getConversations();
                setConversations(convos);

                // --- CHANGE 2: THIS LOGIC SELECTS THE CORRECT CHAT ---
                if (activeChatId) {
                    // Find the conversation that includes the tutor we clicked on
                    const preselectedConversation = convos.find(c =>
                        c.participants.some(p => p.id === activeChatId)
                    );

                    if (preselectedConversation) {
                        // Use your existing function to open the chat
                        await handleSelectConversation(preselectedConversation);
                    }
                } else if (convos.length > 0 && !activeConversation) {
                    // If no specific chat is requested, just open the most recent one
                    await handleSelectConversation(convos[0]);
                }
                // --- END OF CHANGE ---

            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndSetData();
    }, [user, activeChatId]); // Depend on activeChatId to react to clicks

    // --- EFFECT 3: SCROLL TO THE LATEST MESSAGE (No changes needed here) ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversation]);

    // --- HANDLERS AND HELPERS (No changes needed here) ---
    const handleSelectConversation = async (conv: Conversation) => {
        setActiveConversation(conv);
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

    // --- RENDER LOGIC (JSX) - No changes needed, it works automatically now ---
    return (
        <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">
            <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {/* ... your conversation list JSX ... */}
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
                    })}
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

// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';
// import { io, Socket } from 'socket.io-client';
// import { chatApiService } from '@/services/api/api';
// import { API_BASE_URL } from '@/services/api/api.constants';
// import { useAppContext } from '@/context/AppContext';
// import { Conversation, Message, UserProfile } from '@/types';
// import { format, parseISO, isToday } from 'date-fns';

// // Helper function to format timestamps for display
// const formatTimestamp = (isoDate: string) => {
//     try {
//         const date = parseISO(isoDate);
//         if (isToday(date)) {
//             return format(date, 'p'); // '4:30 PM'
//         }
//         return format(date, 'MMM d'); // 'Sep 6'
//     } catch (error) {
//         return '...'; // Fallback for invalid dates
//     }
// };

// export default function ChatScreen({ tutor, onClose }: { tutor: any; onClose: () => void }) {
//     // --- CHANGE 1: GET 'activeChatId' FROM THE CONTEXT ---
//     const { user, activeChatId } = useAppContext();

//     const [isLoading, setIsLoading] = useState(true);
//     const [conversations, setConversations] = useState<Conversation[]>([]);
//     const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
//     const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
//     const [newMessage, setNewMessage] = useState('');
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     // --- EFFECT 1: MANAGE WEBSOCKET CONNECTION ---
//     useEffect(() => {
//         if (!user) return;

//         const newSocket = io(API_BASE_URL);
//         setSocket(newSocket);
//         newSocket.emit('joinRoom', user.id);
//         newSocket.on('newMessage', (incomingMessage: Message) => {
//             setMessages(prev => {
//                 const conversationId = incomingMessage.conversation.id;
//                 const existingMessages = prev[conversationId] || [];
//                 if (existingMessages.some(msg => msg.id === incomingMessage.id)) {
//                     return prev;
//                 }
//                 return {
//                     ...prev,
//                     [conversationId]: [...existingMessages, incomingMessage],
//                 };
//             });
//         });

//         return () => {
//             newSocket.off('newMessage');
//             newSocket.disconnect();
//         };
//     }, [user]);

//     // --- EFFECT 2: FETCH INITIAL DATA AND SELECT ACTIVE CHAT ---
//     useEffect(() => {
//         if (!user) return;
//         const fetchAndSetData = async () => {
//             setIsLoading(true);
//             try {
//                 const convos = await chatApiService.getConversations();
//                 setConversations(convos);

//                 // --- CHANGE 2: THIS LOGIC SELECTS THE CORRECT CHAT ---
//                 if (activeChatId) {
//                     // If an active ID was passed from the context (e.g., from TutorCard)
//                     const preselectedConversation = convos.find(c => c.id === activeChatId);
//                     if (preselectedConversation) {
//                         await handleSelectConversation(preselectedConversation);
//                     }
//                 } else if (convos.length > 0) {
//                     // Otherwise, just open the first (most recent) conversation
//                     await handleSelectConversation(convos[0]);
//                 }
//                 // --- END OF CHANGE ---

//             } catch (error) {
//                 console.error("Failed to fetch conversations:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchAndSetData();
//     }, [user, activeChatId]); // Depend on activeChatId to react to changes

//     // --- EFFECT 3: SCROLL TO THE LATEST MESSAGE ---
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages, activeConversation]);

//     // --- HANDLERS AND HELPERS ---
//     const handleSelectConversation = async (conv: Conversation) => {
//         setActiveConversation(conv);
//         if (!messages[conv.id]) {
//             try {
//                 const history = await chatApiService.getMessages(conv.id);
//                 setMessages(prev => ({ ...prev, [conv.id]: history }));
//             } catch (error) {
//                 console.error(`Failed to fetch messages for conversation ${conv.id}:`, error);
//             }
//         }
//     };

//     const handleSendMessage = () => {
//         if (!newMessage.trim() || !activeConversation || !socket || !user) return;

//         socket.emit('sendMessage', {
//             authorId: user.id,
//             conversationId: activeConversation.id,
//             content: newMessage,
//         });

//         setNewMessage('');
//     };

//     const getOtherParticipant = (conv: Conversation): UserProfile | undefined => {
//         if (!user) return undefined;
//         return conv.participants.find(p => p.id !== user.id);
//     };

//     const activeConvMessages = activeConversation ? messages[activeConversation.id] || [] : [];
//     const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;

//     // --- RENDER LOGIC (JSX) ---
//     return (
//         <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">
//             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
//                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
//                     <h1 className="text-xl font-bold">Messages</h1>
//                     <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
//                 </header>
//                 <div className="p-4 flex-shrink-0">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                         <input type="text" placeholder="Search conversations..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
//                     </div>
//                 </div>
//                 <div className="overflow-y-auto flex-grow">
//                     {isLoading && <p className="text-center text-slate-400 p-4">Loading chats...</p>}
//                     {!isLoading && conversations.map(conv => {
//                         const otherParticipant = getOtherParticipant(conv);
//                         if (!otherParticipant) return null;
//                         return (
//                             <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversation?.id === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
//                                 <img src={otherParticipant.profileImageUrl || `https://ui-avatars.com/api/?name=${otherParticipant.name.replace(' ', '+')}&background=2563eb&color=fff&rounded=true`} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />
//                                 <div className="ml-4 flex-grow overflow-hidden">
//                                     <div className="flex justify-between items-center">
//                                         <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
//                                         <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTimestamp(conv.updatedAt)}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>
//             </aside>
//             <main className={`flex-1 flex-col ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
//                 {activeConversation && otherUser ? (
//                     <>
//                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
//                             <div className="flex items-center">
//                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversation(null)}><ArrowLeft size={20} /></button>
//                                 <img src={otherUser.profileImageUrl || `https://ui-avatars.com/api/?name=${otherUser.name.replace(' ', '+')}`} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
//                                 <div><h2 className="font-semibold text-lg">{otherUser.name}</h2></div>
//                             </div>
//                             <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
//                         </header>
//                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900">
//                             <div className="space-y-6">
//                                 {activeConvMessages.map(msg => (
//                                     <div key={msg.id} className={`flex items-end gap-3 ${msg.author.id === user?.id ? 'justify-end' : 'justify-start'}`}>
//                                         {msg.author.id !== user?.id && <img src={msg.author.profileImageUrl || `https://ui-avatars.com/api/?name=${msg.author.name.replace(' ', '+')}`} alt={msg.author.name} className="w-8 h-8 rounded-full self-start" />}
//                                         <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.author.id === user?.id ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
//                                             <p className="text-sm">{msg.content}</p>
//                                             <p className="text-xs text-slate-400/80 text-right mt-1">{formatTimestamp(msg.timestamp)}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                         </div>
//                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
//                             <div className="flex items-center bg-slate-700 rounded-lg px-2">
//                                 <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" />
//                                 <button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button>
//                             </div>
//                         </footer>
//                     </>
//                 ) : (
//                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg>
//                         <h2 className="text-xl font-medium">Select a conversation</h2>
//                         <p className="text-sm">Choose from your existing conversations to start chatting.</p>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }


// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';
// // import { io, Socket } from 'socket.io-client';
// // import { chatApiService } from '@/services/api/api';
// // import { API_BASE_URL } from '@/services/api/api.constants';
// // import { useAppContext } from '@/context/AppContext';
// // import { Conversation, Message, UserProfile } from '@/types';
// // import { format, parseISO, isToday } from 'date-fns';

// // // Helper function to format timestamps for display
// // const formatTimestamp = (isoDate: string) => {
// //     const date = parseISO(isoDate);
// //     if (isToday(date)) {
// //         return format(date, 'p'); // '4:30 PM'
// //     }
// //     return format(date, 'MMM d'); // 'Sep 6'
// // };



// // export default function ChatScreen({ onClose }: { onClose: () => void }) {
// //     const { user } = useAppContext();
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [conversations, setConversations] = useState<Conversation[]>([]);
// //     const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
// //     const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
// //     const [newMessage, setNewMessage] = useState('');
// //     const [socket, setSocket] = useState<Socket | null>(null);
// //     const messagesEndRef = useRef<HTMLDivElement>(null);

// //     // --- EFFECT 1: MANAGE WEBSOCKET CONNECTION ---
// //     useEffect(() => {
// //         if (!user) return;

// //         const newSocket = io(API_BASE_URL); // Uses your existing URL constant
// //         setSocket(newSocket);

// //         newSocket.emit('joinRoom', user.id);

// //         newSocket.on('newMessage', (incomingMessage: Message) => {
// //             setMessages(prev => {
// //                 const conversationId = incomingMessage.conversation.id;
// //                 const existingMessages = prev[conversationId] || [];
// //                 // Avoid adding duplicate messages if it's already there
// //                 if (existingMessages.some(msg => msg.id === incomingMessage.id)) {
// //                     return prev;
// //                 }
// //                 return {
// //                     ...prev,
// //                     [conversationId]: [...existingMessages, incomingMessage],
// //                 };
// //             });
// //         });

// //         return () => {
// //             newSocket.off('newMessage');
// //             newSocket.disconnect();
// //         };
// //     }, [user]);

// //     // --- EFFECT 2: FETCH INITIAL CONVERSATION LIST ---
// //     useEffect(() => {
// //         if (!user) return;
// //         const fetchConversations = async () => {
// //             setIsLoading(true);
// //             try {
// //                 const convos = await chatApiService.getConversations();
// //                 setConversations(convos);
// //                 if (convos.length > 0) {
// //                     await handleSelectConversation(convos[0]);
// //                 }
// //             } catch (error) {
// //                 console.error("Failed to fetch conversations:", error);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };
// //         fetchConversations();
// //     }, [user]);

// //     // --- EFFECT 3: SCROLL TO THE LATEST MESSAGE ---
// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }, [messages, activeConversation]);

// //     // --- HANDLERS AND HELPERS ---
// //     const handleSelectConversation = async (conv: Conversation) => {
// //         setActiveConversation(conv);
// //         if (!messages[conv.id]) {
// //             try {
// //                 const history = await chatApiService.getMessages(conv.id);
// //                 setMessages(prev => ({ ...prev, [conv.id]: history }));
// //             } catch (error) {
// //                 console.error(`Failed to fetch messages for conversation ${conv.id}:`, error);
// //             }
// //         }
// //     };

// //     const handleSendMessage = () => {
// //         if (!newMessage.trim() || !activeConversation || !socket || !user) return;

// //         socket.emit('sendMessage', {
// //             authorId: user.id,
// //             conversationId: activeConversation.id,
// //             content: newMessage,
// //         });

// //         setNewMessage('');
// //     };

// //     const getOtherParticipant = (conv: Conversation): UserProfile | undefined => {
// //         if (!user) return undefined;
// //         return conv.participants.find(p => p.id !== user.id);
// //     };

// //     const activeConvMessages = activeConversation ? messages[activeConversation.id] || [] : [];
// //     const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;

// //     // --- RENDER LOGIC ---
// //     return (
// //         <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">
// //             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
// //                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
// //                     <h1 className="text-xl font-bold">Messages</h1>
// //                     <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
// //                 </header>
// //                 <div className="p-4 flex-shrink-0">
// //                     <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
// //                         <input type="text" placeholder="Search conversations..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
// //                     </div>
// //                 </div>
// //                 <div className="overflow-y-auto flex-grow">
// //                     {isLoading && <p className="text-center text-slate-400 p-4">Loading chats...</p>}
// //                     {!isLoading && conversations.map(conv => {
// //                         const otherParticipant = getOtherParticipant(conv);
// //                         if (!otherParticipant) return null;
// //                         return (
// //                             <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversation?.id === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
// //                                 <img src={otherParticipant.profileImageUrl || `https://ui-avatars.com/api/?name=${otherParticipant.name.replace(' ', '+')}&background=2563eb&color=fff&rounded=true`} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />
// //                                 <div className="ml-4 flex-grow overflow-hidden">
// //                                     <div className="flex justify-between items-center">
// //                                         <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
// //                                         <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTimestamp(conv.updatedAt)}</span>
// //                                     </div>
// //                                     {/* Future feature: Add a preview of the last message here */}
// //                                 </div>
// //                             </div>
// //                         )
// //                     })}
// //                 </div>
// //             </aside>
// //             <main className={`flex-1 flex-col ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
// //                 {activeConversation && otherUser ? (
// //                     <>
// //                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
// //                             <div className="flex items-center">
// //                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversation(null)}><ArrowLeft size={20} /></button>
// //                                 <img src={otherUser.profileImageUrl || `https://ui-avatars.com/api/?name=${otherUser.name.replace(' ', '+')}`} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
// //                                 <div><h2 className="font-semibold text-lg">{otherUser.name}</h2></div>
// //                             </div>
// //                             <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
// //                         </header>
// //                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900">
// //                             <div className="space-y-6">
// //                                 {activeConvMessages.map(msg => (
// //                                     <div key={msg.id} className={`flex items-end gap-3 ${msg.author.id === user?.id ? 'justify-end' : 'justify-start'}`}>
// //                                         {msg.author.id !== user?.id && <img src={msg.author.profileImageUrl || `https://ui-avatars.com/api/?name=${msg.author.name.replace(' ', '+')}`} alt={msg.author.name} className="w-8 h-8 rounded-full self-start" />}
// //                                         <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.author.id === user?.id ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
// //                                             <p className="text-sm">{msg.content}</p>
// //                                             <p className="text-xs text-slate-400/80 text-right mt-1">{formatTimestamp(msg.timestamp)}</p>
// //                                         </div>
// //                                     </div>
// //                                 ))}
// //                                 <div ref={messagesEndRef} />
// //                             </div>
// //                         </div>
// //                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
// //                             <div className="flex items-center bg-slate-700 rounded-lg px-2">
// //                                 <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" />
// //                                 <button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button>
// //                             </div>
// //                         </footer>
// //                     </>
// //                 ) : (
// //                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex">
// //                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg>
// //                         <h2 className="text-xl font-medium">Select a conversation</h2>
// //                         <p className="text-sm">Choose from your existing conversations to start chatting.</p>
// //                     </div>
// //                 )}
// //             </main>
// //         </div>
// //     );
// // }


// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';

// // // --- MOCK DATA (Unchanged) ---
// // const conversationsData = [
// //     { id: 1, name: 'Mr. David Chen', avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`, lastMessage: 'Sounds good! I will review your essay...', timestamp: '10:42 AM', unread: 0, online: true },
// //     { id: 2, name: 'Ms. Emily Carter', avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`, lastMessage: 'Yes, we can definitely focus on calculus...', timestamp: '9:15 AM', unread: 2, online: false },
// //     { id: 3, name: 'Annex Support', avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`, lastMessage: 'Welcome to Annex! How can we help?', timestamp: 'Yesterday', unread: 0, online: true }
// // ];
// // const messagesData: { [key: number]: any[] } = {
// //     1: [{ id: 1, type: 'received', text: "Hi! I'm struggling with my history essay...", timestamp: '10:30 AM' }, { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history.', timestamp: '10:31 AM' }],
// //     2: [{ id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your lesson.', timestamp: '8:50 AM' }, { id: 2, type: 'received', text: 'Thank you for your purchase!', timestamp: '9:05 AM' }],
// //     3: [{ id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' }]
// // };

// // export default function ChatScreen({ onClose }: { onClose: () => void }) {
// //     const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
// //     const [conversations, setConversations] = useState(conversationsData);
// //     const [messages, setMessages] = useState(messagesData);
// //     const [newMessage, setNewMessage] = useState('');
// //     const messagesEndRef = useRef<HTMLDivElement>(null);

// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }, [messages, activeConversationId]);

// //     const handleSendMessage = () => {
// //         if (newMessage.trim() === '' || !activeConversationId) return;
// //         const newMsg = { id: Date.now(), type: 'sent', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
// //         setMessages(prev => ({ ...prev, [activeConversationId]: [...prev[activeConversationId], newMsg] }));
// //         setNewMessage('');
// //     };

// //     const activeConversation = conversations.find(c => c.id === activeConversationId);

// //     return (
// //         // ======================= THE ONLY CHANGE IS ON THIS LINE =======================
// //         <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">

// //             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
// //                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
// //                     <h1 className="text-xl font-bold">Messages</h1>
// //                     <button onClick={onClose} className="text-slate-400 hover:text-white">
// //                         <X size={24} />
// //                     </button>
// //                 </header>
// //                 <div className="p-4 flex-shrink-0">
// //                     <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
// //                         <input type="text" placeholder="Search messages..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
// //                     </div>
// //                 </div>
// //                 <div className="overflow-y-auto flex-grow">
// //                     {conversations.map(conv => (
// //                         <div key={conv.id} onClick={() => setActiveConversationId(conv.id)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
// //                             <div className="relative mr-4">
// //                                 <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
// //                                 {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
// //                             </div>
// //                             <div className="flex-grow overflow-hidden">
// //                                 <div className="flex justify-between items-center"><h3 className="font-semibold truncate">{conv.name}</h3><span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span></div>
// //                                 <div className="flex justify-between items-start mt-1"><p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>{conv.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>}</div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </aside>
// //             <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
// //                 {activeConversation ? (
// //                     <>
// //                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
// //                             <div className="flex items-center">
// //                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}><ArrowLeft size={20} /></button>
// //                                 <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
// //                                 <div><h2 className="font-semibold text-lg">{activeConversation.name}</h2><p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p></div>
// //                             </div>
// //                             <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
// //                         </header>
// //                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900"><div className="space-y-6">{messages[activeConversation.id]?.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>{msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}<div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}><p className="text-sm">{msg.text}</p></div></div>))}<div ref={messagesEndRef} /></div></div>
// //                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0"><div className="flex items-center bg-slate-700 rounded-lg px-2"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" /><button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button></div></footer>
// //                     </>
// //                 ) : (
// //                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg><h2 className="text-xl font-medium">Select a conversation</h2><p className="text-sm">Choose from your existing conversations to start chatting.</p></div>
// //                 )}
// //             </main>
// //         </div>
// //     );
// // }


// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';

// // // --- MOCK DATA (Unchanged) ---
// // const conversationsData = [
// //     { id: 1, name: 'Mr. David Chen', avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`, lastMessage: 'Sounds good! I will review your essay...', timestamp: '10:42 AM', unread: 0, online: true },
// //     { id: 2, name: 'Ms. Emily Carter', avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`, lastMessage: 'Yes, we can definitely focus on calculus...', timestamp: '9:15 AM', unread: 2, online: false },
// //     { id: 3, name: 'Annex Support', avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`, lastMessage: 'Welcome to Annex! How can we help?', timestamp: 'Yesterday', unread: 0, online: true }
// // ];
// // const messagesData: { [key: number]: any[] } = {
// //     1: [{ id: 1, type: 'received', text: "Hi! I'm struggling with my history essay...", timestamp: '10:30 AM' }, { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history.', timestamp: '10:31 AM' }],
// //     2: [{ id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your lesson.', timestamp: '8:50 AM' }, { id: 2, type: 'received', text: 'Thank you for your purchase!', timestamp: '9:05 AM' }],
// //     3: [{ id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' }]
// // };

// // // --- CHAT SCREEN COMPONENT ---

// // // MODIFICATION #1: The component now accepts an "onClose" function as a prop.
// // export default function ChatScreen({ onClose }: { onClose: () => void }) {
// //     const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
// //     const [conversations, setConversations] = useState(conversationsData);
// //     const [messages, setMessages] = useState(messagesData);
// //     const [newMessage, setNewMessage] = useState('');
// //     const messagesEndRef = useRef<HTMLDivElement>(null);

// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }, [messages, activeConversationId]);

// //     const handleSendMessage = () => {
// //         if (newMessage.trim() === '' || !activeConversationId) return;
// //         const newMsg = { id: Date.now(), type: 'sent', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
// //         setMessages(prev => ({ ...prev, [activeConversationId]: [...prev[activeConversationId], newMsg] }));
// //         setNewMessage('');
// //     };

// //     const activeConversation = conversations.find(c => c.id === activeConversationId);

// //     return (
// //         <div className="fixed inset-0 bg-slate-900 text-white flex z-50 h-screen font-sans">
// //             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
// //                 {/* Header of the sidebar */}
// //                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
// //                     <h1 className="text-xl font-bold">Messages</h1>

// //                     {/* MODIFICATION #2: Added a close button that calls the onClose function. */}
// //                     <button onClick={onClose} className="text-slate-400 hover:text-white">
// //                         <X size={24} />
// //                     </button>
// //                 </header>

// //                 {/* Search Bar */}
// //                 <div className="p-4 flex-shrink-0">
// //                     <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
// //                         <input type="text" placeholder="Search messages..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
// //                     </div>
// //                 </div>

// //                 {/* Conversation List */}
// //                 <div className="overflow-y-auto flex-grow">
// //                     {conversations.map(conv => (
// //                         <div key={conv.id} onClick={() => setActiveConversationId(conv.id)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
// //                             <div className="relative mr-4">
// //                                 <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
// //                                 {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
// //                             </div>
// //                             <div className="flex-grow overflow-hidden">
// //                                 <div className="flex justify-between items-center"><h3 className="font-semibold truncate">{conv.name}</h3><span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span></div>
// //                                 <div className="flex justify-between items-start mt-1"><p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>{conv.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>}</div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </aside>

// //             {/* Main Chat Window */}
// //             <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
// //                 {activeConversation ? (
// //                     <>
// //                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
// //                             <div className="flex items-center">
// //                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}><ArrowLeft size={20} /></button>
// //                                 <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
// //                                 <div><h2 className="font-semibold text-lg">{activeConversation.name}</h2><p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p></div>
// //                             </div>
// //                             <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
// //                         </header>
// //                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900"><div className="space-y-6">{messages[activeConversation.id]?.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>{msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}<div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}><p className="text-sm">{msg.text}</p></div></div>))}<div ref={messagesEndRef} /></div></div>
// //                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0"><div className="flex items-center bg-slate-700 rounded-lg px-2"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" /><button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button></div></footer>
// //                     </>
// //                 ) : (
// //                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg><h2 className="text-xl font-medium">Select a conversation</h2><p className="text-sm">Choose from your existing conversations to start chatting.</p></div>
// //                 )}
// //             </main>
// //         </div>
// //     );
// // }


// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import { Search, Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

// // // --- MOCK DATA ---
// // // In a real application, this data would come from your API
// // const conversationsData = [
// //     {
// //         id: 1,
// //         name: 'Mr. David Chen',
// //         avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`,
// //         lastMessage: 'Sounds good! I will review your essay and get back to you.',
// //         timestamp: '10:42 AM',
// //         unread: 0,
// //         online: true,
// //     },
// //     {
// //         id: 2,
// //         name: 'Ms. Emily Carter',
// //         avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`,
// //         lastMessage: 'Yes, we can definitely focus on calculus next session.',
// //         timestamp: '9:15 AM',
// //         unread: 2,
// //         online: false,
// //     },
// //     {
// //         id: 3,
// //         name: 'Annex Support',
// //         avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`,
// //         lastMessage: 'Welcome to Annex! How can we help you get started?',
// //         timestamp: 'Yesterday',
// //         unread: 0,
// //         online: true,
// //     }
// // ];

// // const messagesData: { [key: number]: any[] } = {
// //     1: [
// //         { id: 1, type: 'received', text: "Hi! I'm struggling with my history essay on the Cold War. Can you help?", timestamp: '10:30 AM' },
// //         { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history. What specific areas are you finding difficult?', timestamp: '10:31 AM' },
// //         { id: 3, type: 'received', text: 'Mostly the ideological differences between the US and the Soviet Union.', timestamp: '10:35 AM' },
// //         { id: 4, type: 'sent', text: 'Great, that\'s a fascinating topic. I have a lesson bundle on that. I can also schedule a one-on-one session to outline the essay with you.', timestamp: '10:40 AM' },
// //         { id: 5, type: 'received', text: 'Sounds good! I will review your essay and get back to you.', timestamp: '10:42 AM' },
// //     ],
// //     2: [
// //         { id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your calculus lesson. Thank you!', timestamp: '8:50 AM' },
// //         { id: 2, type: 'received', text: 'Thank you for your purchase! Let me know if you have any questions.', timestamp: '9:05 AM' },
// //         { id: 3, type: 'received', text: 'Yes, we can definitely focus on calculus next session.', timestamp: '9:15 AM' },
// //     ],
// //     3: [
// //         { id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' },
// //     ]
// // };
// // // --- END OF MOCK DATA ---


// // export default function ChatScreen() {
// //     const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
// //     const [conversations, setConversations] = useState(conversationsData);
// //     const [messages, setMessages] = useState(messagesData);
// //     const [newMessage, setNewMessage] = useState('');
// //     const messagesEndRef = useRef<HTMLDivElement>(null);


// //     useEffect(() => {
// //         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //     }, [messages, activeConversationId]);

// //     const handleSendMessage = () => {
// //         if (newMessage.trim() === '' || !activeConversationId) return;

// //         const newMsg = {
// //             id: Date.now(),
// //             type: 'sent',
// //             text: newMessage,
// //             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //         };

// //         setMessages(prev => ({
// //             ...prev,
// //             [activeConversationId]: [...prev[activeConversationId], newMsg],
// //         }));

// //         setNewMessage('');
// //     };

// //     const activeConversation = conversations.find(c => c.id === activeConversationId);

// //     return (
// //         <div className="fixed inset-0 bg-slate-900 text-white flex z-50 h-screen font-sans">
// //             {/* --- Sidebar with Conversation List --- */}
// //             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
// //                 {/* Header */}
// //                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
// //                     <h1 className="text-xl font-bold">Messages</h1>
// //                     <button className="text-slate-400 hover:text-white">
// //                         <MoreVertical size={20} />
// //                     </button>
// //                 </header>

// //                 {/* Search */}
// //                 <div className="p-4 flex-shrink-0">
// //                     <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
// //                         <input
// //                             type="text"
// //                             placeholder="Search messages..."
// //                             className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                         />
// //                     </div>
// //                 </div>

// //                 {/* Conversation List */}
// //                 <div className="overflow-y-auto flex-grow">
// //                     {conversations.map(conv => (
// //                         <div
// //                             key={conv.id}
// //                             onClick={() => setActiveConversationId(conv.id)}
// //                             className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}
// //                         >
// //                             <div className="relative mr-4">
// //                                 <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
// //                                 {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
// //                             </div>
// //                             <div className="flex-grow overflow-hidden">
// //                                 <div className="flex justify-between items-center">
// //                                     <h3 className="font-semibold truncate">{conv.name}</h3>
// //                                     <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span>
// //                                 </div>
// //                                 <div className="flex justify-between items-start mt-1">
// //                                     <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
// //                                     {conv.unread > 0 &&
// //                                         <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>
// //                                     }
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </aside>

// //             {/* --- Main Chat Window --- */}
// //             <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
// //                 {activeConversation ? (
// //                     <>
// //                         {/* Chat Header */}
// //                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
// //                             <div className="flex items-center">
// //                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}>
// //                                     <ArrowLeft size={20} />
// //                                 </button>
// //                                 <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
// //                                 <div>
// //                                     <h2 className="font-semibold text-lg">{activeConversation.name}</h2>
// //                                     <p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p>
// //                                 </div>
// //                             </div>
// //                             <div className="flex items-center space-x-4">
// //                                 <button className="text-slate-400 hover:text-white"><Phone size={20} /></button>
// //                                 <button className="text-slate-400 hover:text-white"><Video size={20} /></button>
// //                                 <button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button>
// //                             </div>
// //                         </header>

// //                         {/* Messages */}
// //                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900">
// //                             <div className="space-y-6">
// //                                 {messages[activeConversation.id]?.map(msg => (
// //                                     <div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
// //                                         {msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}
// //                                         <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
// //                                             <p className="text-sm">{msg.text}</p>
// //                                         </div>
// //                                     </div>
// //                                 ))}
// //                                 <div ref={messagesEndRef} />
// //                             </div>
// //                         </div>

// //                         {/* Message Input */}
// //                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
// //                             <div className="flex items-center bg-slate-700 rounded-lg px-2">
// //                                 <textarea
// //                                     value={newMessage}
// //                                     onChange={(e) => setNewMessage(e.target.value)}
// //                                     onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
// //                                     placeholder="Type a message..."
// //                                     rows={1}
// //                                     className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24"
// //                                 />
// //                                 <button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}>
// //                                     <Send size={20} />
// //                                 </button>
// //                             </div>
// //                         </footer>
// //                     </>
// //                 ) : (
// //                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex">
// //                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg>
// //                         <h2 className="text-xl font-medium">Select a conversation</h2>
// //                         <p className="text-sm">Choose from your existing conversations to start chatting.</p>
// //                     </div>
// //                 )}
// //             </main>
// //         </div>
// //     );
// // }



// // // // /components/ContactModal.tsx

// // // 'use client';

// // // import { useState } from 'react';
// // // import { X } from 'lucide-react';

// // // // Define the structure of the props the component expects
// // // interface ContactModalProps {
// // //     tutor: any;
// // //     onClose: () => void;
// // // }

// // // const ContactModal = ({ tutor, onClose }: ContactModalProps) => {
// // //     const [message, setMessage] = useState('');

// // //     const handleSend = () => {
// // //         if (message.trim() === '') {
// // //             alert('Please write a message first.');
// // //             return;
// // //         }
// // //         // In a real app, this is where you would send the message to your backend API
// // //         console.log(`Sending message to ${tutor.name}: "${message}"`);
// // //         alert(`Your message has been sent to ${tutor.title} ${tutor.name.split(' ').pop()}!`);
// // //         onClose(); // Close the modal after sending
// // //     };

// // //     const nameParts = tutor.name?.split(' ') || [];
// // //     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

// // //     return (
// // //         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
// // //             <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
// // //                 <button
// // //                     onClick={onClose}
// // //                     className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
// // //                 >
// // //                     <X className="h-6 w-6" />
// // //                 </button>
// // //                 <h2 className="text-2xl font-bold text-white mb-4">
// // //                     Message {tutor.title} {surname}
// // //                 </h2>
// // //                 <p className="text-slate-400 mb-6">
// // //                     Introduce yourself and let them know what you need help with. Tutors typically respond within 24 hours.
// // //                 </p>
// // //                 <textarea
// // //                     value={message}
// // //                     onChange={(e) => setMessage(e.target.value)}
// // //                     className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-slate-500"
// // //                     placeholder={`Hi ${tutor.title} ${surname}, I'm looking for help with...`}
// // //                 />
// // //                 <button
// // //                     onClick={handleSend}
// // //                     className="w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center"
// // //                 >
// // //                     Send Message
// // //                 </button>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default ContactModal;