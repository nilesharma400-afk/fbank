import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, User, Mail, CreditCard, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hashPassword, encryptPersonalData } from "@/lib/advancedCrypto";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Registration state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    aadhaar: "",
    pan: "",
    bankAccount: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const hashedPassword = await hashPassword(loginData.password);
      
      const user = users.find(
        (u: any) => u.email === loginData.email && u.passwordHash === hashedPassword
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast({
          title: "Login Successful!",
          description: "Welcome back to Smart Bank AI",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user already exists
      if (users.find((u: any) => u.email === registerData.email)) {
        toast({
          title: "Registration Failed",
          description: "Email already registered",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Hash password
      const passwordHash = await hashPassword(registerData.password);

      // Encrypt sensitive data using password as master key
      const encryptedData = await encryptPersonalData({
        aadhaar: registerData.aadhaar,
        pan: registerData.pan,
        bankAccount: registerData.bankAccount,
      }, registerData.password);

      // Create user object
      const newUser = {
        id: Date.now().toString(),
        name: registerData.name,
        email: registerData.email,
        passwordHash,
        encryptedData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      toast({
        title: "Registration Successful!",
        description: "Your data has been encrypted with AES-256-GCM. You can now login.",
      });

      // Auto-login
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Smart Bank AI</CardTitle>
          <CardDescription>Secure loan approval with cryptographic protection</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password (Master Encryption Key)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    🔐 This password will encrypt your Aadhaar, PAN, and bank details
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-primary">Sensitive Data (Will be encrypted)</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Aadhaar Number
                    </Label>
                    <Input
                      id="aadhaar"
                      placeholder="1234 5678 9012"
                      value={registerData.aadhaar}
                      onChange={(e) => setRegisterData({ ...registerData, aadhaar: e.target.value })}
                      required
                      maxLength={12}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pan" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      PAN Card
                    </Label>
                    <Input
                      id="pan"
                      placeholder="ABCDE1234F"
                      value={registerData.pan}
                      onChange={(e) => setRegisterData({ ...registerData, pan: e.target.value.toUpperCase() })}
                      required
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccount" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Bank Account Number
                    </Label>
                    <Input
                      id="bankAccount"
                      placeholder="1234567890123456"
                      value={registerData.bankAccount}
                      onChange={(e) => setRegisterData({ ...registerData, bankAccount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Encrypting & Registering..." : "Register with Encryption"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;