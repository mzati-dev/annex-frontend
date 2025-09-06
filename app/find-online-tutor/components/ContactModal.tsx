'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';

// --- MOCK DATA (Unchanged) ---
const conversationsData = [
    { id: 1, name: 'Mr. David Chen', avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`, lastMessage: 'Sounds good! I will review your essay...', timestamp: '10:42 AM', unread: 0, online: true },
    { id: 2, name: 'Ms. Emily Carter', avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`, lastMessage: 'Yes, we can definitely focus on calculus...', timestamp: '9:15 AM', unread: 2, online: false },
    { id: 3, name: 'Annex Support', avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`, lastMessage: 'Welcome to Annex! How can we help?', timestamp: 'Yesterday', unread: 0, online: true }
];
const messagesData: { [key: number]: any[] } = {
    1: [{ id: 1, type: 'received', text: "Hi! I'm struggling with my history essay...", timestamp: '10:30 AM' }, { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history.', timestamp: '10:31 AM' }],
    2: [{ id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your lesson.', timestamp: '8:50 AM' }, { id: 2, type: 'received', text: 'Thank you for your purchase!', timestamp: '9:05 AM' }],
    3: [{ id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' }]
};

export default function ChatScreen({ onClose }: { onClose: () => void }) {
    const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
    const [conversations, setConversations] = useState(conversationsData);
    const [messages, setMessages] = useState(messagesData);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversationId]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !activeConversationId) return;
        const newMsg = { id: Date.now(), type: 'sent', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => ({ ...prev, [activeConversationId]: [...prev[activeConversationId], newMsg] }));
        setNewMessage('');
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        // ======================= THE ONLY CHANGE IS ON THIS LINE =======================
        <div className="fixed inset-0 top-16 bg-slate-900 text-white flex z-50 h-[calc(100vh-4rem)] font-sans">

            <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-xl font-bold">Messages</h1>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </header>
                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search messages..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {conversations.map(conv => (
                        <div key={conv.id} onClick={() => setActiveConversationId(conv.id)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
                            <div className="relative mr-4">
                                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                                {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center"><h3 className="font-semibold truncate">{conv.name}</h3><span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span></div>
                                <div className="flex justify-between items-start mt-1"><p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>{conv.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
            <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center">
                                <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}><ArrowLeft size={20} /></button>
                                <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                <div><h2 className="font-semibold text-lg">{activeConversation.name}</h2><p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p></div>
                            </div>
                            <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
                        </header>
                        <div className="flex-grow p-6 overflow-y-auto bg-slate-900"><div className="space-y-6">{messages[activeConversation.id]?.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>{msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}<div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}><p className="text-sm">{msg.text}</p></div></div>))}<div ref={messagesEndRef} /></div></div>
                        <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0"><div className="flex items-center bg-slate-700 rounded-lg px-2"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" /><button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button></div></footer>
                    </>
                ) : (
                    <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg><h2 className="text-xl font-medium">Select a conversation</h2><p className="text-sm">Choose from your existing conversations to start chatting.</p></div>
                )}
            </main>
        </div>
    );
}


// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, X } from 'lucide-react';

// // --- MOCK DATA (Unchanged) ---
// const conversationsData = [
//     { id: 1, name: 'Mr. David Chen', avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`, lastMessage: 'Sounds good! I will review your essay...', timestamp: '10:42 AM', unread: 0, online: true },
//     { id: 2, name: 'Ms. Emily Carter', avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`, lastMessage: 'Yes, we can definitely focus on calculus...', timestamp: '9:15 AM', unread: 2, online: false },
//     { id: 3, name: 'Annex Support', avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`, lastMessage: 'Welcome to Annex! How can we help?', timestamp: 'Yesterday', unread: 0, online: true }
// ];
// const messagesData: { [key: number]: any[] } = {
//     1: [{ id: 1, type: 'received', text: "Hi! I'm struggling with my history essay...", timestamp: '10:30 AM' }, { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history.', timestamp: '10:31 AM' }],
//     2: [{ id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your lesson.', timestamp: '8:50 AM' }, { id: 2, type: 'received', text: 'Thank you for your purchase!', timestamp: '9:05 AM' }],
//     3: [{ id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' }]
// };

// // --- CHAT SCREEN COMPONENT ---

// // MODIFICATION #1: The component now accepts an "onClose" function as a prop.
// export default function ChatScreen({ onClose }: { onClose: () => void }) {
//     const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
//     const [conversations, setConversations] = useState(conversationsData);
//     const [messages, setMessages] = useState(messagesData);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages, activeConversationId]);

//     const handleSendMessage = () => {
//         if (newMessage.trim() === '' || !activeConversationId) return;
//         const newMsg = { id: Date.now(), type: 'sent', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
//         setMessages(prev => ({ ...prev, [activeConversationId]: [...prev[activeConversationId], newMsg] }));
//         setNewMessage('');
//     };

//     const activeConversation = conversations.find(c => c.id === activeConversationId);

//     return (
//         <div className="fixed inset-0 bg-slate-900 text-white flex z-50 h-screen font-sans">
//             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
//                 {/* Header of the sidebar */}
//                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
//                     <h1 className="text-xl font-bold">Messages</h1>

//                     {/* MODIFICATION #2: Added a close button that calls the onClose function. */}
//                     <button onClick={onClose} className="text-slate-400 hover:text-white">
//                         <X size={24} />
//                     </button>
//                 </header>

//                 {/* Search Bar */}
//                 <div className="p-4 flex-shrink-0">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                         <input type="text" placeholder="Search messages..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
//                     </div>
//                 </div>

//                 {/* Conversation List */}
//                 <div className="overflow-y-auto flex-grow">
//                     {conversations.map(conv => (
//                         <div key={conv.id} onClick={() => setActiveConversationId(conv.id)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}>
//                             <div className="relative mr-4">
//                                 <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
//                                 {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
//                             </div>
//                             <div className="flex-grow overflow-hidden">
//                                 <div className="flex justify-between items-center"><h3 className="font-semibold truncate">{conv.name}</h3><span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span></div>
//                                 <div className="flex justify-between items-start mt-1"><p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>{conv.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>}</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </aside>

//             {/* Main Chat Window */}
//             <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
//                 {activeConversation ? (
//                     <>
//                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
//                             <div className="flex items-center">
//                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}><ArrowLeft size={20} /></button>
//                                 <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
//                                 <div><h2 className="font-semibold text-lg">{activeConversation.name}</h2><p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p></div>
//                             </div>
//                             <div className="flex items-center space-x-4"><button className="text-slate-400 hover:text-white"><Phone size={20} /></button><button className="text-slate-400 hover:text-white"><Video size={20} /></button><button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button></div>
//                         </header>
//                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900"><div className="space-y-6">{messages[activeConversation.id]?.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>{msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}<div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}><p className="text-sm">{msg.text}</p></div></div>))}<div ref={messagesEndRef} /></div></div>
//                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0"><div className="flex items-center bg-slate-700 rounded-lg px-2"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Type a message..." rows={1} className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24" /><button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}><Send size={20} /></button></div></footer>
//                     </>
//                 ) : (
//                     <div className="flex-col items-center justify-center h-full text-slate-500 hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg><h2 className="text-xl font-medium">Select a conversation</h2><p className="text-sm">Choose from your existing conversations to start chatting.</p></div>
//                 )}
//             </main>
//         </div>
//     );
// }


// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Search, Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

// // --- MOCK DATA ---
// // In a real application, this data would come from your API
// const conversationsData = [
//     {
//         id: 1,
//         name: 'Mr. David Chen',
//         avatar: `https://ui-avatars.com/api/?name=David+Chen&background=2563eb&color=fff&rounded=true`,
//         lastMessage: 'Sounds good! I will review your essay and get back to you.',
//         timestamp: '10:42 AM',
//         unread: 0,
//         online: true,
//     },
//     {
//         id: 2,
//         name: 'Ms. Emily Carter',
//         avatar: `https://ui-avatars.com/api/?name=Emily+Carter&background=db2777&color=fff&rounded=true`,
//         lastMessage: 'Yes, we can definitely focus on calculus next session.',
//         timestamp: '9:15 AM',
//         unread: 2,
//         online: false,
//     },
//     {
//         id: 3,
//         name: 'Annex Support',
//         avatar: `https://ui-avatars.com/api/?name=Annex+Support&background=16a34a&color=fff&rounded=true`,
//         lastMessage: 'Welcome to Annex! How can we help you get started?',
//         timestamp: 'Yesterday',
//         unread: 0,
//         online: true,
//     }
// ];

// const messagesData: { [key: number]: any[] } = {
//     1: [
//         { id: 1, type: 'received', text: "Hi! I'm struggling with my history essay on the Cold War. Can you help?", timestamp: '10:30 AM' },
//         { id: 2, type: 'sent', text: 'Of course. I specialize in 20th-century history. What specific areas are you finding difficult?', timestamp: '10:31 AM' },
//         { id: 3, type: 'received', text: 'Mostly the ideological differences between the US and the Soviet Union.', timestamp: '10:35 AM' },
//         { id: 4, type: 'sent', text: 'Great, that\'s a fascinating topic. I have a lesson bundle on that. I can also schedule a one-on-one session to outline the essay with you.', timestamp: '10:40 AM' },
//         { id: 5, type: 'received', text: 'Sounds good! I will review your essay and get back to you.', timestamp: '10:42 AM' },
//     ],
//     2: [
//         { id: 1, type: 'sent', text: 'Hi Ms. Carter, I just purchased your calculus lesson. Thank you!', timestamp: '8:50 AM' },
//         { id: 2, type: 'received', text: 'Thank you for your purchase! Let me know if you have any questions.', timestamp: '9:05 AM' },
//         { id: 3, type: 'received', text: 'Yes, we can definitely focus on calculus next session.', timestamp: '9:15 AM' },
//     ],
//     3: [
//         { id: 1, type: 'received', text: 'Welcome to Annex! How can we help you get started?', timestamp: 'Yesterday' },
//     ]
// };
// // --- END OF MOCK DATA ---


// export default function ChatScreen() {
//     const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
//     const [conversations, setConversations] = useState(conversationsData);
//     const [messages, setMessages] = useState(messagesData);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef<HTMLDivElement>(null);


//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages, activeConversationId]);

//     const handleSendMessage = () => {
//         if (newMessage.trim() === '' || !activeConversationId) return;

//         const newMsg = {
//             id: Date.now(),
//             type: 'sent',
//             text: newMessage,
//             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         };

//         setMessages(prev => ({
//             ...prev,
//             [activeConversationId]: [...prev[activeConversationId], newMsg],
//         }));

//         setNewMessage('');
//     };

//     const activeConversation = conversations.find(c => c.id === activeConversationId);

//     return (
//         <div className="fixed inset-0 bg-slate-900 text-white flex z-50 h-screen font-sans">
//             {/* --- Sidebar with Conversation List --- */}
//             <aside className={`w-full md:w-1/3 lg:w-1/4 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
//                 {/* Header */}
//                 <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
//                     <h1 className="text-xl font-bold">Messages</h1>
//                     <button className="text-slate-400 hover:text-white">
//                         <MoreVertical size={20} />
//                     </button>
//                 </header>

//                 {/* Search */}
//                 <div className="p-4 flex-shrink-0">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                         <input
//                             type="text"
//                             placeholder="Search messages..."
//                             className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>
//                 </div>

//                 {/* Conversation List */}
//                 <div className="overflow-y-auto flex-grow">
//                     {conversations.map(conv => (
//                         <div
//                             key={conv.id}
//                             onClick={() => setActiveConversationId(conv.id)}
//                             className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors ${activeConversationId === conv.id ? 'bg-slate-900 border-blue-500' : 'border-transparent hover:bg-slate-700/50'}`}
//                         >
//                             <div className="relative mr-4">
//                                 <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
//                                 {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800"></span>}
//                             </div>
//                             <div className="flex-grow overflow-hidden">
//                                 <div className="flex justify-between items-center">
//                                     <h3 className="font-semibold truncate">{conv.name}</h3>
//                                     <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.timestamp}</span>
//                                 </div>
//                                 <div className="flex justify-between items-start mt-1">
//                                     <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
//                                     {conv.unread > 0 &&
//                                         <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ml-2 flex-shrink-0">{conv.unread}</span>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </aside>

//             {/* --- Main Chat Window --- */}
//             <main className={`flex-1 flex-col ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
//                 {activeConversation ? (
//                     <>
//                         {/* Chat Header */}
//                         <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
//                             <div className="flex items-center">
//                                 <button className="md:hidden mr-4 text-slate-300" onClick={() => setActiveConversationId(null)}>
//                                     <ArrowLeft size={20} />
//                                 </button>
//                                 <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
//                                 <div>
//                                     <h2 className="font-semibold text-lg">{activeConversation.name}</h2>
//                                     <p className="text-xs text-green-400">{activeConversation.online ? 'Online' : 'Offline'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center space-x-4">
//                                 <button className="text-slate-400 hover:text-white"><Phone size={20} /></button>
//                                 <button className="text-slate-400 hover:text-white"><Video size={20} /></button>
//                                 <button className="text-slate-400 hover:text-white"><MoreVertical size={20} /></button>
//                             </div>
//                         </header>

//                         {/* Messages */}
//                         <div className="flex-grow p-6 overflow-y-auto bg-slate-900">
//                             <div className="space-y-6">
//                                 {messages[activeConversation.id]?.map(msg => (
//                                     <div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
//                                         {msg.type === 'received' && <img src={activeConversation.avatar} alt="Tutor Avatar" className="w-8 h-8 rounded-full self-start" />}
//                                         <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${msg.type === 'sent' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
//                                             <p className="text-sm">{msg.text}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                         </div>

//                         {/* Message Input */}
//                         <footer className="p-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
//                             <div className="flex items-center bg-slate-700 rounded-lg px-2">
//                                 <textarea
//                                     value={newMessage}
//                                     onChange={(e) => setNewMessage(e.target.value)}
//                                     onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
//                                     placeholder="Type a message..."
//                                     rows={1}
//                                     className="w-full bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none max-h-24"
//                                 />
//                                 <button onClick={handleSendMessage} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!newMessage.trim()}>
//                                     <Send size={20} />
//                                 </button>
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



// // // /components/ContactModal.tsx

// // 'use client';

// // import { useState } from 'react';
// // import { X } from 'lucide-react';

// // // Define the structure of the props the component expects
// // interface ContactModalProps {
// //     tutor: any;
// //     onClose: () => void;
// // }

// // const ContactModal = ({ tutor, onClose }: ContactModalProps) => {
// //     const [message, setMessage] = useState('');

// //     const handleSend = () => {
// //         if (message.trim() === '') {
// //             alert('Please write a message first.');
// //             return;
// //         }
// //         // In a real app, this is where you would send the message to your backend API
// //         console.log(`Sending message to ${tutor.name}: "${message}"`);
// //         alert(`Your message has been sent to ${tutor.title} ${tutor.name.split(' ').pop()}!`);
// //         onClose(); // Close the modal after sending
// //     };

// //     const nameParts = tutor.name?.split(' ') || [];
// //     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

// //     return (
// //         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
// //             <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
// //                 <button
// //                     onClick={onClose}
// //                     className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
// //                 >
// //                     <X className="h-6 w-6" />
// //                 </button>
// //                 <h2 className="text-2xl font-bold text-white mb-4">
// //                     Message {tutor.title} {surname}
// //                 </h2>
// //                 <p className="text-slate-400 mb-6">
// //                     Introduce yourself and let them know what you need help with. Tutors typically respond within 24 hours.
// //                 </p>
// //                 <textarea
// //                     value={message}
// //                     onChange={(e) => setMessage(e.target.value)}
// //                     className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-white placeholder-slate-500"
// //                     placeholder={`Hi ${tutor.title} ${surname}, I'm looking for help with...`}
// //                 />
// //                 <button
// //                     onClick={handleSend}
// //                     className="w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center"
// //                 >
// //                     Send Message
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default ContactModal;