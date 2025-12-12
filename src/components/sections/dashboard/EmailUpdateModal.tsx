import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import userService from '@/services/userService';

interface EmailUpdateModalProps {
    open: boolean;
    onClose: () => void;
    currentEmail: string;
    onSuccess: () => void;
}

const EmailUpdateModal = ({ open, onClose, currentEmail, onSuccess }: EmailUpdateModalProps) => {
    const [step, setStep] = useState(1);
    const [currentEmailCode, setCurrentEmailCode] = useState(['', '', '', '']);
    const [newEmail, setNewEmail] = useState('');
    const [newEmailCode, setNewEmailCode] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([[], []]);

    const sendCurrentEmailCode = async () => {
        try {
            setSendingCode(true);
            await userService.sendCurrentEmailVerificationCode();
            toast.success('Verification code sent to your email');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send verification code');
        } finally {
            setSendingCode(false);
        }
    };

    const sendNewEmailCode = async () => {
        try {
            setSendingCode(true);
            await userService.sendNewEmailVerificationCode(newEmail);
            toast.success('Verification code sent to your new email');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send verification code');
        } finally {
            setSendingCode(false);
        }
    };

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setStep(1);
            setCurrentEmailCode(['', '', '', '']);
            setNewEmail('');
            setNewEmailCode(['', '', '', '']);
            // Send code to current email when modal opens
            sendCurrentEmailCode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleCodeInput = (index: number, value: string, stepNumber: number) => {
        const codeArray = stepNumber === 1 ? currentEmailCode : newEmailCode;
        const setCodeArray = stepNumber === 1 ? setCurrentEmailCode : setNewEmailCode;
        
        // Only allow digits
        const digit = value.replace(/\D/g, '').slice(0, 1);
        
        if (digit) {
            const newCode = [...codeArray];
            newCode[index] = digit;
            setCodeArray(newCode);
            
            // Auto-focus next input
            if (index < 3 && inputRefs.current[stepNumber - 1][index + 1]) {
                inputRefs.current[stepNumber - 1][index + 1]?.focus();
            }
        } else {
            const newCode = [...codeArray];
            newCode[index] = '';
            setCodeArray(newCode);
        }
    };

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent, stepNumber: number) => {
        const codeArray = stepNumber === 1 ? currentEmailCode : newEmailCode;
        
        if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
            // Focus previous input on backspace
            inputRefs.current[stepNumber - 1][index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent, stepNumber: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        const codeArray = stepNumber === 1 ? currentEmailCode : newEmailCode;
        const setCodeArray = stepNumber === 1 ? setCurrentEmailCode : setNewEmailCode;
        
        const newCode = [...codeArray];
        for (let i = 0; i < 4; i++) {
            newCode[i] = pastedData[i] || '';
        }
        setCodeArray(newCode);
        
        // Focus last filled input or first empty
        const lastIndex = Math.min(pastedData.length - 1, 3);
        inputRefs.current[stepNumber - 1][lastIndex]?.focus();
    };

    const handleStep1Continue = async () => {
        const code = currentEmailCode.join('');
        if (code.length !== 4) {
            toast.error('Please enter the complete 4-digit code');
            return;
        }

        try {
            setIsLoading(true);
            await userService.verifyCurrentEmailCode(code);
            toast.success('Email verified successfully');
            setStep(2);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
            setCurrentEmailCode(['', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Continue = async () => {
        if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (newEmail === currentEmail) {
            toast.error('New email must be different from your current email');
            return;
        }

        try {
            setIsLoading(true);
            await userService.updateEmail(newEmail);
            toast.success('Email updated. Please verify your new email');
            setStep(3);
            // Send code to new email
            await sendNewEmailCode();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3Continue = async () => {
        const code = newEmailCode.join('');
        if (code.length !== 4) {
            toast.error('Please enter the complete 4-digit code');
            return;
        }

        try {
            setIsLoading(true);
            await userService.verifyNewEmailCode(code);
            toast.success('Email updated successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
            setNewEmailCode(['', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Change email address</DialogTitle>
                        <button
                            onClick={onClose}
                            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-6">
                    {/* Step 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {step > 1 ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                    <Check className="h-5 w-5 text-white" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
                                    <span className="text-white font-semibold text-sm">1</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-foreground">
                                    Enter verification code sent to <strong>{currentEmail}</strong>
                                </p>
                            </div>
                        </div>
                        {step === 1 && (
                            <div className="ml-11 space-y-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={sendCurrentEmailCode}
                                        disabled={sendingCode}
                                        className="text-sm text-purple hover:underline disabled:opacity-50"
                                    >
                                        Resend code
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                if (!inputRefs.current[0]) inputRefs.current[0] = [];
                                                inputRefs.current[0][index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={currentEmailCode[index]}
                                            onChange={(e) => handleCodeInput(index, e.target.value, 1)}
                                            onKeyDown={(e) => handleCodeKeyDown(index, e, 1)}
                                            onPaste={(e) => handlePaste(e, 1)}
                                            className="w-14 h-14 text-center text-xl font-semibold border-2 border-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                                        />
                                    ))}
                                </div>
                                <Button
                                    onClick={handleStep1Continue}
                                    disabled={isLoading || currentEmailCode.join('').length !== 4}
                                    className="w-full bg-purple hover:bg-purple-dark text-white"
                                >
                                    {isLoading ? 'Verifying...' : 'Continue'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {step > 2 ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                    <Check className="h-5 w-5 text-white" />
                                </div>
                            ) : step === 2 ? (
                                <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
                                    <span className="text-white font-semibold text-sm">2</span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                                    <span className="text-gray-600 font-semibold text-sm">2</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className={`text-sm ${step >= 2 ? 'text-foreground' : 'text-gray-400'}`}>
                                    Enter your new email address
                                </p>
                            </div>
                        </div>
                        {step === 2 && (
                            <div className="ml-11 space-y-4">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email address"
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                />
                                <Button
                                    onClick={handleStep2Continue}
                                    disabled={isLoading || !newEmail}
                                    className="w-full bg-purple hover:bg-purple-dark text-white"
                                >
                                    {isLoading ? 'Updating...' : 'Continue'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {step === 3 ? (
                                <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
                                    <span className="text-white font-semibold text-sm">3</span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                                    <span className="text-gray-600 font-semibold text-sm">3</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className={`text-sm ${step === 3 ? 'text-foreground' : 'text-gray-400'}`}>
                                    Verify email address
                                </p>
                            </div>
                        </div>
                        {step === 3 && (
                            <div className="ml-11 space-y-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={sendNewEmailCode}
                                        disabled={sendingCode}
                                        className="text-sm text-purple hover:underline disabled:opacity-50"
                                    >
                                        Resend code
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                if (!inputRefs.current[1]) inputRefs.current[1] = [];
                                                inputRefs.current[1][index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={newEmailCode[index]}
                                            onChange={(e) => handleCodeInput(index, e.target.value, 3)}
                                            onKeyDown={(e) => handleCodeKeyDown(index, e, 3)}
                                            onPaste={(e) => handlePaste(e, 3)}
                                            className="w-14 h-14 text-center text-xl font-semibold border-2 border-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                                        />
                                    ))}
                                </div>
                                <Button
                                    onClick={handleStep3Continue}
                                    disabled={isLoading || newEmailCode.join('').length !== 4}
                                    className="w-full bg-purple hover:bg-purple-dark text-white"
                                >
                                    {isLoading ? 'Verifying...' : 'Continue'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EmailUpdateModal;

