import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, CreditCard, LogOut, Brain, Lock, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { decryptPersonalData } from "@/lib/advancedCrypto";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [showDecrypted, setShowDecrypted] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/auth");
  };

  const handleViewEncryptedData = async () => {
    if (!user) return;
    
    const password = prompt("Enter your password to decrypt sensitive data:");
    if (!password) return;

    try {
      const decrypted = await decryptPersonalData(user.encryptedData, password);
      setDecryptedData(decrypted);
      setShowDecrypted(true);
      toast({
        title: "Data Decrypted",
        description: "Your encrypted data has been successfully decrypted",
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid password or corrupted data",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Bank AI</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* System Architecture */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Hybrid AI System Architecture</CardTitle>
            <CardDescription>Your loans are evaluated using three advanced techniques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-primary" />
                  <span className="text-2xl font-bold">33%</span>
                </div>
                <h3 className="font-semibold mb-1">AIML</h3>
                <p className="text-sm text-muted-foreground">
                  Neural Network with 29 trainable parameters (5→4→1 architecture)
                </p>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-8 h-8 text-accent" />
                  <span className="text-2xl font-bold">33%</span>
                </div>
                <h3 className="font-semibold mb-1">Soft Computing</h3>
                <p className="text-sm text-muted-foreground">
                  Fuzzy Logic with linguistic variables and inference rules
                </p>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold">33%</span>
                </div>
                <h3 className="font-semibold mb-1">Cryptography</h3>
                <p className="text-sm text-muted-foreground">
                  AES-256-GCM encryption for all personal data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate("/loan-application")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Apply for Loan
              </CardTitle>
              <CardDescription>Submit a new loan application with AI evaluation</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate("/history")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application History
              </CardTitle>
              <CardDescription>View your past loan applications and results</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Encrypted Data Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" />
              Your Encrypted Personal Data
            </CardTitle>
            <CardDescription>
              All sensitive information is protected with AES-256-GCM encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                <span className="text-sm font-medium">Aadhaar Number</span>
                <span className="text-xs text-green-500">🔒 Encrypted</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                <span className="text-sm font-medium">PAN Card</span>
                <span className="text-xs text-green-500">🔒 Encrypted</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded">
                <span className="text-sm font-medium">Bank Account</span>
                <span className="text-xs text-green-500">🔒 Encrypted</span>
              </div>
            </div>

            <Button onClick={handleViewEncryptedData} variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Decrypt & View Data
            </Button>

            {showDecrypted && decryptedData && (
              <div className="p-4 bg-green-950/20 border border-green-500/20 rounded space-y-2">
                <p className="text-sm font-semibold text-green-500">Decrypted Data:</p>
                <div className="space-y-1 text-sm font-mono">
                  <p>Aadhaar: {decryptedData.aadhaar}</p>
                  <p>PAN: {decryptedData.pan}</p>
                  <p>Bank: {decryptedData.bankAccount}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;