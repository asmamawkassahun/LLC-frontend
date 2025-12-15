import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import SuspendedNavbar from '@/components/layout/SuspendedNavbar';

const SuspendedAccountPage = () => {
  return (
    <div className="min-h-screen pt-4 bg-background">
      <SuspendedNavbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4">
                <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">Account Suspended</CardTitle>
            <CardDescription className="text-base mt-2">
              Your account has been temporarily suspended
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                We're sorry, but your account has been suspended. This may be due to a violation of our terms of service or for security reasons.
              </p>
              <p className="text-muted-foreground">
                If you believe this is an error or would like to appeal this decision, please contact our support team.
              </p>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">How to Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Use the "Get Help" button</p>
                    <p className="text-sm text-muted-foreground">
                      Click the "Get Help" button in the navigation bar above to create a support ticket. Our team will respond as soon as possible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">
                      Send an email to: <a href="mailto:support@kimem.com" className="text-primary hover:underline">support@kimem.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">
                      Call us at: <a href="tel:+15074104666" className="text-primary hover:underline">+1 (507) 410-4666</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> Our support team typically responds within 24-48 hours during business days. 
                Please include your account email address in your support request for faster assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuspendedAccountPage;

