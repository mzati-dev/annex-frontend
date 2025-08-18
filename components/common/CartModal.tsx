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


