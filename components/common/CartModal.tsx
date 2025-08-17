'use client';

import { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { X, Trash2, ShoppingCart, Loader2, Check, Wallet, Banknote, Smartphone, CreditCard } from 'lucide-react';
import Button from './Button';
import { purchaseApiService } from '@/services/api/purchase-api.service';

type PaymentMethod = 'airtel' | 'mpamba' | 'bank' | 'zanga' | null;

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { cart, removeFromCart, purchaseCart } = useAppContext();
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);

    const total = useMemo(() =>
        cart.reduce((sum, item) => {
            const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
            return sum + price;
        }, 0),
        [cart]
    );

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!showPaymentMethods) {
            setShowPaymentMethods(true);
            return;
        }

        if (!selectedPaymentMethod) {
            return;
        }

        setIsProcessing(true);
        try {
            // Mock payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockPaymentResponse = { success: true, transactionId: 'mock123' };

            if (mockPaymentResponse.success) {
                const items = cart.map(item => ({ lessonId: item.id }));
                const response = await purchaseApiService.checkout(items, {
                    amount: total,
                    paymentMethod: selectedPaymentMethod,
                    transactionId: mockPaymentResponse.transactionId
                });

                purchaseCart();
                setPurchaseSuccess(true);
                

                setTimeout(() => {
                    setPurchaseSuccess(false);
                    setShowPaymentMethods(false);
                    setSelectedPaymentMethod(null);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsProcessing(false);
        }

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">
                        {showPaymentMethods ? 'Select Payment Method' : 'Shopping Cart'}
                    </h2>
                    <Button onClick={onClose} variant="ghost" disabled={isProcessing}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {!showPaymentMethods ? (
                        cart.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Your cart is empty.</p>
                        ) : (
                            <ul className="space-y-4">
                                {cart.map(item => (
                                    <li key={item.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-md">
                                        <div>
                                            <p className="text-sm text-slate-400">
                                                {item.subject} - MWK {(typeof item.price === 'number' ? item.price : Number(item.price) || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => removeFromCart(item.id)}
                                            variant="ghost"
                                            className="text-slate-400 hover:text-red-400"
                                            disabled={isProcessing}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white mb-4">Choose payment method:</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <PaymentOption
                                    icon={<Smartphone className="h-6 w-6" />}
                                    name="Airtel Money"
                                    selected={selectedPaymentMethod === 'airtel'}
                                    onClick={() => setSelectedPaymentMethod('airtel')}
                                />

                                <PaymentOption
                                    icon={<Wallet className="h-6 w-6" />}
                                    name="Mpamba"
                                    selected={selectedPaymentMethod === 'mpamba'}
                                    onClick={() => setSelectedPaymentMethod('mpamba')}
                                />

                                <PaymentOption
                                    icon={<Banknote className="h-6 w-6" />}
                                    name="Bank Transfer"
                                    selected={selectedPaymentMethod === 'bank'}
                                    onClick={() => setSelectedPaymentMethod('bank')}
                                />

                                <PaymentOption
                                    icon={<CreditCard className="h-6 w-6" />}
                                    name="Zanga Wallet"
                                    selected={selectedPaymentMethod === 'zanga'}
                                    onClick={() => setSelectedPaymentMethod('zanga')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                        <div className="flex justify-between items-center mb-4 text-lg">
                            <span className="text-slate-300">Total:</span>
                            <span className="font-bold text-white">
                                MWK {(typeof total === 'number' ? total : Number(total) || 0).toFixed(2)}
                            </span>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full"
                            disabled={isProcessing || purchaseSuccess}
                        >
                            {isProcessing ? (
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            ) : purchaseSuccess ? (
                                <Check className="h-5 w-5 mr-2" />
                            ) : showPaymentMethods ? (
                                selectedPaymentMethod ? (
                                    <>
                                        {getPaymentIcon(selectedPaymentMethod)}
                                        <span className="ml-2">Pay with {getPaymentName(selectedPaymentMethod)}</span>
                                    </>
                                ) : (
                                    'Select Payment Method'
                                )
                            ) : (
                                <>
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    <span>Proceed to Checkout</span>
                                </>
                            )}
                        </Button>

                        {showPaymentMethods && (
                            <Button
                                onClick={() => {
                                    setShowPaymentMethods(false);
                                    setSelectedPaymentMethod(null);
                                }}
                                variant="ghost"
                                className="w-full mt-2 text-slate-400 hover:text-white"
                                disabled={isProcessing}
                            >
                                Back to Cart
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function PaymentOption({ icon, name, selected, onClick }: {
    icon: React.ReactNode,
    name: string,
    selected: boolean,
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-colors ${selected
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
        >
            <div className="mb-2">{icon}</div>
            <span className="text-sm font-medium">{name}</span>
        </button>
    );
}

function getPaymentIcon(method: PaymentMethod) {
    switch (method) {
        case 'airtel': return <Smartphone className="h-5 w-5 mr-2" />;
        case 'mpamba': return <Wallet className="h-5 w-5 mr-2" />;
        case 'bank': return <Banknote className="h-5 w-5 mr-2" />;
        case 'zanga': return <CreditCard className="h-5 w-5 mr-2" />;
        default: return null;
    }
}

function getPaymentName(method: PaymentMethod) {
    switch (method) {
        case 'airtel': return 'Airtel Money';
        case 'mpamba': return 'Mpamba';
        case 'bank': return 'Bank Transfer';
        case 'zanga': return 'Zanga Wallet';
        default: return '';
    }
}


// 'use client';

// import { useMemo, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { X, Trash2, ShoppingCart, Loader2, Check, Wallet, Banknote, Smartphone, CreditCard } from 'lucide-react';
// import Button from './Button';
// import { purchaseApiService } from '@/services/api/purchase-api.service';
// import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

// type PaymentMethod = 'airtel' | 'mpamba' | 'bank' | 'zanga' | null;

// export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//     const { cart, removeFromCart, purchaseCart, user } = useAppContext();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [purchaseSuccess, setPurchaseSuccess] = useState(false);
//     const [showPaymentMethods, setShowPaymentMethods] = useState(false);
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [paymentError, setPaymentError] = useState('');

//     const total = useMemo(() =>
//         cart.reduce((sum, item) => {
//             const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
//             return sum + price;
//         }, 0),
//         [cart]
//     );

//     // Flutterwave configuration
//     const config = {
//         public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLUTTERWAVE_TEST_PUBLIC_KEY',
//         tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//         amount: total,
//         currency: 'MWK',
//         payment_options: 'mobilemoney',
//         customer: {
//             email: user?.email || 'customer@example.com',
//             phone_number: phoneNumber || '265888888888', // Default to test number in development
//             name: user?.name || 'Customer',
//         },
//         customizations: {
//             title: 'My Learning App',
//             description: `Payment for ${cart.length} item(s)`,
//             logo: '/logo.png',
//         },
//     };

//     const handleFlutterwavePayment = useFlutterwave(config);

//     const processPayment = async (method: PaymentMethod, amount: number) => {
//         try {
//             // Mobile money payments via Flutterwave
//             if (method === 'airtel' || method === 'mpamba') {
//                 if (!phoneNumber && process.env.NODE_ENV === 'production') {
//                     return { success: false, error: 'Phone number is required' };
//                 }

//                 return new Promise((resolve) => {
//                     handleFlutterwavePayment({
//                         callback: (response) => {
//                             if (response.status === 'completed') {
//                                 resolve({ 
//                                     success: true, 
//                                     transactionId: response.transaction_id.toString() 
//                                 });
//                             } else {
//                                 resolve({ 
//                                     success: false, 
//                                     error: response.message || 'Payment failed' 
//                                 });
//                             }
//                             closePaymentModal();
//                         },
//                         onClose: () => {
//                             resolve({ success: false, error: 'Payment window closed' });
//                         },
//                     });
//                 });
//             }
            
//             // Mock processing for other methods (bank/zanga)
//             console.log(`Processing MWK ${amount} via ${method}`);
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             return { success: true, transactionId: `mock-${Date.now()}` };
            
//         } catch (error) {
//             console.error('Payment processing error:', error);
//             return { success: false, error: 'Payment processing failed' };
//         }
//     };

//     const handleCheckout = async () => {
//         if (cart.length === 0) return;

//         // First show payment methods
//         if (!showPaymentMethods) {
//             setShowPaymentMethods(true);
//             return;
//         }

//         // Validate payment method selection
//         if (!selectedPaymentMethod) {
//             setPaymentError('Please select a payment method');
//             return;
//         }

//         // Validate phone number for mobile money in production
//         if ((selectedPaymentMethod === 'airtel' || selectedPaymentMethod === 'mpamba') && 
//             !phoneNumber && 
//             process.env.NODE_ENV === 'production') {
//             setPaymentError('Please enter your phone number');
//             return;
//         }

//         setPaymentError('');
//         setIsProcessing(true);

//         try {
//             const paymentResponse = await processPayment(selectedPaymentMethod, total);

//             if (paymentResponse.success) {
//                 const items = cart.map(item => ({ lessonId: item.id }));
//                 const response = await purchaseApiService.checkout(items, {
//                     amount: total,
//                     paymentMethod: selectedPaymentMethod,
//                     transactionId: paymentResponse.transactionId
//                 });

//                 purchaseCart();
//                 setPurchaseSuccess(true);

//                 setTimeout(() => {
//                     setPurchaseSuccess(false);
//                     setShowPaymentMethods(false);
//                     setSelectedPaymentMethod(null);
//                     onClose();
//                 }, 2000);
//             } else {
//                 throw new Error(paymentResponse.error || 'Payment failed');
//             }
//         } catch (error) {
//             console.error('Checkout error:', error);
//             setPaymentError(error.message || 'Payment failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
//             <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in" onClick={e => e.stopPropagation()}>
//                 <div className="flex justify-between items-center p-4 border-b border-slate-700">
//                     <h2 className="text-xl font-semibold text-white">
//                         {showPaymentMethods ? 'Select Payment Method' : 'Shopping Cart'}
//                     </h2>
//                     <Button onClick={onClose} variant="ghost" disabled={isProcessing}>
//                         <X className="h-5 w-5" />
//                     </Button>
//                 </div>

//                 <div className="p-6 max-h-[60vh] overflow-y-auto">
//                     {!showPaymentMethods ? (
//                         cart.length === 0 ? (
//                             <p className="text-slate-400 text-center py-8">Your cart is empty.</p>
//                         ) : (
//                             <ul className="space-y-4">
//                                 {cart.map(item => (
//                                     <li key={item.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-md">
//                                         <div>
//                                             <p className="text-sm text-slate-400">
//                                                 {item.subject} - MWK {(typeof item.price === 'number' ? item.price : Number(item.price) || 0).toFixed(2)}
//                                             </p>
//                                         </div>
//                                         <Button
//                                             onClick={() => removeFromCart(item.id)}
//                                             variant="ghost"
//                                             className="text-slate-400 hover:text-red-400"
//                                             disabled={isProcessing}
//                                         >
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )
//                     ) : (
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-medium text-white mb-4">Choose payment method:</h3>
                            
//                             {(selectedPaymentMethod === 'airtel' || selectedPaymentMethod === 'mpamba') && (
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-slate-300 mb-1">
//                                         {selectedPaymentMethod === 'airtel' ? 'Airtel' : 'Mpamba'} Phone Number
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         placeholder="265XXXXXXXX"
//                                         className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         value={phoneNumber}
//                                         onChange={(e) => setPhoneNumber(e.target.value)}
//                                         disabled={isProcessing}
//                                     />
//                                     <p className="text-xs text-slate-400 mt-1">
//                                         {process.env.NODE_ENV === 'development' && 
//                                          'Test mode: Use 265888888888'}
//                                     </p>
//                                 </div>
//                             )}

//                             <div className="grid grid-cols-2 gap-4">
//                                 <PaymentOption
//                                     icon={<Smartphone className="h-6 w-6" />}
//                                     name="Airtel Money"
//                                     selected={selectedPaymentMethod === 'airtel'}
//                                     onClick={() => setSelectedPaymentMethod('airtel')}
//                                 />
                                
//                                 <PaymentOption
//                                     icon={<Wallet className="h-6 w-6" />}
//                                     name="Mpamba"
//                                     selected={selectedPaymentMethod === 'mpamba'}
//                                     onClick={() => setSelectedPaymentMethod('mpamba')}
//                                 />
                                
//                                 <PaymentOption
//                                     icon={<Banknote className="h-6 w-6" />}
//                                     name="Bank Transfer"
//                                     selected={selectedPaymentMethod === 'bank'}
//                                     onClick={() => setSelectedPaymentMethod('bank')}
//                                 />
                                
//                                 <PaymentOption
//                                     icon={<CreditCard className="h-6 w-6" />}
//                                     name="Zanga Wallet"
//                                     selected={selectedPaymentMethod === 'zanga'}
//                                     onClick={() => setSelectedPaymentMethod('zanga')}
//                                 />
//                             </div>

//                             {paymentError && (
//                                 <p className="text-red-400 text-sm mt-2">{paymentError}</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
                
//                 {cart.length > 0 && (
//                     <div className="p-4 border-t border-slate-700 bg-slate-800/50">
//                         <div className="flex justify-between items-center mb-4 text-lg">
//                             <span className="text-slate-300">Total:</span>
//                             <span className="font-bold text-white">
//                                 MWK {(typeof total === 'number' ? total : Number(total) || 0).toFixed(2)}
//                             </span>
//                         </div>
                        
//                         <Button
//                             onClick={handleCheckout}
//                             className="w-full"
//                             disabled={isProcessing || purchaseSuccess}
//                         >
//                             {isProcessing ? (
//                                 <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                             ) : purchaseSuccess ? (
//                                 <Check className="h-5 w-5 mr-2" />
//                             ) : showPaymentMethods ? (
//                                 selectedPaymentMethod ? (
//                                     <>
//                                         {getPaymentIcon(selectedPaymentMethod)}
//                                         <span className="ml-2">Pay with {getPaymentName(selectedPaymentMethod)}</span>
//                                     </>
//                                 ) : (
//                                     'Select Payment Method'
//                                 )
//                             ) : (
//                                 <>
//                                     <ShoppingCart className="h-5 w-5 mr-2" />
//                                     <span>Proceed to Checkout</span>
//                                 </>
//                             )}
//                         </Button>
                        
//                         {showPaymentMethods && (
//                             <Button
//                                 onClick={() => {
//                                     setShowPaymentMethods(false);
//                                     setSelectedPaymentMethod(null);
//                                     setPaymentError('');
//                                 }}
//                                 variant="ghost"
//                                 className="w-full mt-2 text-slate-400 hover:text-white"
//                                 disabled={isProcessing}
//                             >
//                                 Back to Cart
//                             </Button>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Helper component for payment options
// function PaymentOption({ icon, name, selected, onClick }: { 
//     icon: React.ReactNode, 
//     name: string, 
//     selected: boolean, 
//     onClick: () => void 
// }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-colors ${
//                 selected 
//                     ? 'border-blue-500 bg-blue-500/10 text-white' 
//                     : 'border-slate-700 hover:border-slate-600 text-slate-300'
//             }`}
//             disabled={selected}
//         >
//             <div className="mb-2">{icon}</div>
//             <span className="text-sm font-medium">{name}</span>
//         </button>
//     );
// }

// // Helper functions
// function getPaymentIcon(method: PaymentMethod) {
//     switch(method) {
//         case 'airtel': return <Smartphone className="h-5 w-5 mr-2" />;
//         case 'mpamba': return <Wallet className="h-5 w-5 mr-2" />;
//         case 'bank': return <Banknote className="h-5 w-5 mr-2" />;
//         case 'zanga': return <CreditCard className="h-5 w-5 mr-2" />;
//         default: return null;
//     }
// }

// function getPaymentName(method: PaymentMethod) {
//     switch(method) {
//         case 'airtel': return 'Airtel Money';
//         case 'mpamba': return 'Mpamba';
//         case 'bank': return 'Bank Transfer';
//         case 'zanga': return 'Zanga Wallet';
//         default: return '';
//     }
// }

// 'use client';

// import { useMemo, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { X, Trash2, ShoppingCart, Loader2, Check, Wallet, Banknote, Smartphone, CreditCard } from 'lucide-react';
// import Button from './Button';
// // import { toast } from 'react-hot-toast';
// import { purchaseApiService } from '@/services/api/purchase-api.service';

// type PaymentMethod = 'airtel' | 'mpamba' | 'bank' | 'zanga' | null;

// export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//     const { cart, removeFromCart, purchaseCart } = useAppContext();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [purchaseSuccess, setPurchaseSuccess] = useState(false);
//     const [showPaymentMethods, setShowPaymentMethods] = useState(false);
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);

//     const total = useMemo(() =>
//         cart.reduce((sum, item) => {
//             const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
//             return sum + price;
//         }, 0),
//         [cart]
//     );

//     const handleCheckout = async () => {
//         if (cart.length === 0) return;

//         // First show payment methods
//         if (!showPaymentMethods) {
//             setShowPaymentMethods(true);
//             return;
//         }

//         // Proceed with payment if method selected
//         if (!selectedPaymentMethod) {
//             // toast.error('Please select a payment method');
//             return;
//         }

//         setIsProcessing(true);
//         try {
//             // This would be replaced with actual payment gateway integration
//             const paymentResponse = await processPayment(selectedPaymentMethod, total);

//             if (paymentResponse.success) {
//                 const items = cart.map(item => ({ lessonId: item.id }));
//                 const response = await purchaseApiService.checkout(items);

//                 purchaseCart();
//                 setPurchaseSuccess(true);

//                 setTimeout(() => {
//                     setPurchaseSuccess(false);
//                     setShowPaymentMethods(false);
//                     setSelectedPaymentMethod(null);
//                     onClose();
//                 }, 2000);
//             } else {
//                 throw new Error('Payment failed');
//             }
//         } catch (error) {
//             console.error('Checkout error:', error);
//             // toast.error('Payment failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Mock payment processing function
//     const processPayment = async (method: PaymentMethod, amount: number) => {
//         // In a real app, this would call your backend API which then integrates
//         // with the respective payment gateway
//         console.log(`Processing ${amount} via ${method}`);
//         // Simulate API call delay
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         return { success: true, transactionId: 'mock123' };
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
//             <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in" onClick={e => e.stopPropagation()}>
//                 <div className="flex justify-between items-center p-4 border-b border-slate-700">
//                     <h2 className="text-xl font-semibold text-white">
//                         {showPaymentMethods ? 'Select Payment Method' : 'Shopping Cart'}
//                     </h2>
//                     <Button onClick={onClose} variant="ghost" disabled={isProcessing}>
//                         <X className="h-5 w-5" />
//                     </Button>
//                 </div>

//                 <div className="p-6 max-h-[60vh] overflow-y-auto">
//                     {!showPaymentMethods ? (
//                         cart.length === 0 ? (
//                             <p className="text-slate-400 text-center py-8">Your cart is empty.</p>
//                         ) : (
//                             <ul className="space-y-4">
//                                 {cart.map(item => (
//                                     <li key={item.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-md">
//                                         <div>
//                                             <p className="text-sm text-slate-400">
//                                                 {item.subject} - MWK {(typeof item.price === 'number' ? item.price : Number(item.price) || 0).toFixed(2)}
//                                             </p>
//                                         </div>
//                                         <Button
//                                             onClick={() => removeFromCart(item.id)}
//                                             variant="ghost"
//                                             className="text-slate-400 hover:text-red-400"
//                                             disabled={isProcessing}
//                                         >
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )
//                     ) : (
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-medium text-white mb-4">Choose payment method:</h3>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <PaymentOption
//                                     icon={<Smartphone className="h-6 w-6" />}
//                                     name="Airtel Money"
//                                     selected={selectedPaymentMethod === 'airtel'}
//                                     onClick={() => setSelectedPaymentMethod('airtel')}
//                                 />

//                                 <PaymentOption
//                                     icon={<Wallet className="h-6 w-6" />}
//                                     name="Mpamba"
//                                     selected={selectedPaymentMethod === 'mpamba'}
//                                     onClick={() => setSelectedPaymentMethod('mpamba')}
//                                 />

//                                 <PaymentOption
//                                     icon={<Banknote className="h-6 w-6" />}
//                                     name="Bank Transfer"
//                                     selected={selectedPaymentMethod === 'bank'}
//                                     onClick={() => setSelectedPaymentMethod('bank')}
//                                 />

//                                 <PaymentOption
//                                     icon={<CreditCard className="h-6 w-6" />}
//                                     name="Zanga Wallet"
//                                     selected={selectedPaymentMethod === 'zanga'}
//                                     onClick={() => setSelectedPaymentMethod('zanga')}
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {cart.length > 0 && (
//                     <div className="p-4 border-t border-slate-700 bg-slate-800/50">
//                         <div className="flex justify-between items-center mb-4 text-lg">
//                             <span className="text-slate-300">Total:</span>
//                             <span className="font-bold text-white">
//                                 MWK {(typeof total === 'number' ? total : Number(total) || 0).toFixed(2)}
//                             </span>
//                         </div>

//                         <Button
//                             onClick={handleCheckout}
//                             className="w-full"
//                             disabled={isProcessing || purchaseSuccess}
//                         >
//                             {isProcessing ? (
//                                 <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                             ) : purchaseSuccess ? (
//                                 <Check className="h-5 w-5 mr-2" />
//                             ) : showPaymentMethods ? (
//                                 selectedPaymentMethod ? (
//                                     <>
//                                         {getPaymentIcon(selectedPaymentMethod)}
//                                         <span className="ml-2">Pay with {getPaymentName(selectedPaymentMethod)}</span>
//                                     </>
//                                 ) : (
//                                     'Select Payment Method'
//                                 )
//                             ) : (
//                                 <>
//                                     <ShoppingCart className="h-5 w-5 mr-2" />
//                                     <span>Proceed to Checkout</span>
//                                 </>
//                             )}
//                         </Button>

//                         {showPaymentMethods && (
//                             <Button
//                                 onClick={() => {
//                                     setShowPaymentMethods(false);
//                                     setSelectedPaymentMethod(null);
//                                 }}
//                                 variant="ghost"
//                                 className="w-full mt-2 text-slate-400 hover:text-white"
//                                 disabled={isProcessing}
//                             >
//                                 Back to Cart
//                             </Button>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Helper component for payment options
// function PaymentOption({ icon, name, selected, onClick }: {
//     icon: React.ReactNode,
//     name: string,
//     selected: boolean,
//     onClick: () => void
// }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-colors ${selected
//                     ? 'border-blue-500 bg-blue-500/10 text-white'
//                     : 'border-slate-700 hover:border-slate-600 text-slate-300'
//                 }`}
//         >
//             <div className="mb-2">{icon}</div>
//             <span className="text-sm font-medium">{name}</span>
//         </button>
//     );
// }

// // Helper functions
// function getPaymentIcon(method: PaymentMethod) {
//     switch (method) {
//         case 'airtel': return <Smartphone className="h-5 w-5 mr-2" />;
//         case 'mpamba': return <Wallet className="h-5 w-5 mr-2" />;
//         case 'bank': return <Banknote className="h-5 w-5 mr-2" />;
//         case 'zanga': return <CreditCard className="h-5 w-5 mr-2" />;
//         default: return null;
//     }
// }

// function getPaymentName(method: PaymentMethod) {
//     switch (method) {
//         case 'airtel': return 'Airtel Money';
//         case 'mpamba': return 'Mpamba';
//         case 'bank': return 'Bank Transfer';
//         case 'zanga': return 'Zanga Wallet';
//         default: return '';
//     }
// }


// 'use client';

// import { useMemo, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { X, Trash2, ShoppingCart, Loader2, Check } from 'lucide-react';
// import Button from './Button';
// // import { toast } from 'react-hot-toast';
// import { purchaseApiService } from '@/services/api/purchase-api.service';

// export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//     const { cart, removeFromCart, purchaseCart } = useAppContext();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [purchaseSuccess, setPurchaseSuccess] = useState(false);

//     // const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
//     const total = useMemo(() =>
//         cart.reduce((sum, item) => {
//             const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
//             return sum + price;
//         }, 0),
//         [cart]
//     );

//     const handleCheckout = async () => {
//         if (cart.length === 0) return;

//         setIsProcessing(true);
//         try {
//             const items = cart.map(item => ({ lessonId: item.id }));
//             const response = await purchaseApiService.checkout(items);

//             // Clear cart on success
//             purchaseCart();
//             setPurchaseSuccess(true);
//             // toast.success('Purchase completed successfully!');

//             // Close modal after 2 seconds
//             setTimeout(() => {
//                 setPurchaseSuccess(false);
//                 onClose();
//             }, 2000);
//         } catch (error) {
//             // toast.error('Purchase failed. Please try again.');
//             console.error('Checkout error:', error);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
//             <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-700 animate-fade-in" onClick={e => e.stopPropagation()}>
//                 <div className="flex justify-between items-center p-4 border-b border-slate-700">
//                     <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
//                     <Button onClick={onClose} variant="ghost" disabled={isProcessing}>
//                         <X className="h-5 w-5" />
//                     </Button>
//                 </div>
//                 <div className="p-6 max-h-[60vh] overflow-y-auto">
//                     {cart.length === 0 ? (
//                         <p className="text-slate-400 text-center py-8">Your cart is empty.</p>
//                     ) : (
//                         <ul className="space-y-4">
//                             {cart.map(item => (
//                                 <li key={item.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-md">
//                                     <div>
//                                         <p className="text-sm text-slate-400">
//                                             {item.subject} - MWK {(typeof item.price === 'number' ? item.price : Number(item.price) || 0).toFixed(2)}
//                                         </p>

//                                     </div>
//                                     <Button
//                                         onClick={() => removeFromCart(item.id)}
//                                         variant="ghost"
//                                         className="text-slate-400 hover:text-red-400"
//                                         disabled={isProcessing}
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//                 {cart.length > 0 && (
//                     <div className="p-4 border-t border-slate-700 bg-slate-800/50">
//                         <div className="flex justify-between items-center mb-4 text-lg">
//                             <span className="text-slate-300">Total:</span>
//                             <span className="font-bold text-white">
//                                 MWK {(typeof total === 'number' ? total : Number(total) || 0).toFixed(2)}
//                             </span>

//                         </div>
//                         <Button
//                             onClick={handleCheckout}
//                             className="w-full"
//                             disabled={isProcessing || purchaseSuccess}
//                         >
//                             {isProcessing ? (
//                                 <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                             ) : purchaseSuccess ? (
//                                 <Check className="h-5 w-5 mr-2" />
//                             ) : (
//                                 <ShoppingCart className="h-5 w-5 mr-2" />
//                             )}
//                             {isProcessing ? 'Processing...' : purchaseSuccess ? 'Success!' : 'Proceed to Checkout'}
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


