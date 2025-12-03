import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import apiClient from '@/utils/api-helpers/apiClient';
import { toast } from 'sonner';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'pending'>('pending');
    const txRef = searchParams.get('tx_ref');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!txRef) {
                setIsVerifying(false);
                setVerificationStatus('error');
                return;
            }

            try {
                // Call backend to verify payment
                const response = await apiClient.post('/payments/chapa/verify', {
                    tx_ref: txRef,
                });

                if (response.data.success) {
                    setVerificationStatus('success');
                    toast.success('Payment verified successfully!');
                } else {
                    setVerificationStatus('error');
                    toast.error('Payment verification failed');
                }
            } catch (error: any) {
                console.error('Verification error:', error);
                setVerificationStatus('error');
                toast.error(error.response?.data?.message || 'Failed to verify payment');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [txRef]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center">
                {isVerifying ? (
                    <div>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Verifying payment...</p>
                    </div>
                ) : verificationStatus === 'success' ? (
                    <>
                        <HiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2 text-foreground">Payment Successful!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your payment has been processed successfully.
                            {txRef && (
                                <span className="block mt-2 text-sm">
                                    Transaction Reference: {txRef}
                                </span>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('/orders')}
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-2"
                            >
                                View Orders
                            </Button>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                variant="outline"
                                className="px-6 py-2"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <HiXCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2 text-foreground">Verification Failed</h1>
                        <p className="text-muted-foreground mb-6">
                            We couldn't verify your payment. Please contact support if you've been charged.
                            {txRef && (
                                <span className="block mt-2 text-sm">
                                    Transaction Reference: {txRef}
                                </span>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('/orders')}
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-2"
                            >
                                View Orders
                            </Button>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                variant="outline"
                                className="px-6 py-2"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;