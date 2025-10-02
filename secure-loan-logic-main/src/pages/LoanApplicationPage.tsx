import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { evaluateHybridLoan } from "@/lib/hybridLoanSystem";
import { Shield, ArrowLeft, Brain, Cpu, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const LoanApplicationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    income: "",
    loanAmount: "",
    cibilScore: "",
    employmentYears: "",
    existingLoans: "",
  });
  
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const evaluation = evaluateHybridLoan({
      income: parseFloat(formData.income),
      loanAmount: parseFloat(formData.loanAmount),
      cibilScore: parseInt(formData.cibilScore),
      employmentYears: parseFloat(formData.employmentYears),
      existingLoans: parseFloat(formData.existingLoans),
    });
    
    setResult(evaluation);
    
    // Save to history
    const applications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    applications.push({
      id: Date.now(),
      userId: user?.id,
      date: new Date().toISOString(),
      formData,
      result: evaluation,
    });
    localStorage.setItem("loanApplications", JSON.stringify(applications));
    
    setIsLoading(false);
    
    toast({
      title: evaluation.approved ? "Loan Approved! ✓" : "Loan Rejected ✗",
      description: evaluation.explanation,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Loan Application</h1>
              <p className="text-sm text-muted-foreground">Hybrid AI evaluation system</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Your application will be evaluated using AIML (33%), Soft Computing (33%), and secured with Cryptography (33%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="50000"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="500000"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cibilScore">CIBIL Score (300-900)</Label>
                  <Input
                    id="cibilScore"
                    type="number"
                    placeholder="750"
                    value={formData.cibilScore}
                    onChange={(e) => setFormData({ ...formData, cibilScore: e.target.value })}
                    required
                    min="300"
                    max="900"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employmentYears">Employment Years</Label>
                  <Input
                    id="employmentYears"
                    type="number"
                    step="0.1"
                    placeholder="3.5"
                    value={formData.employmentYears}
                    onChange={(e) => setFormData({ ...formData, employmentYears: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="existingLoans">Existing Loans EMI (₹/month)</Label>
                  <Input
                    id="existingLoans"
                    type="number"
                    placeholder="10000"
                    value={formData.existingLoans}
                    onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={isLoading}
              >
                {isLoading ? "Processing with Hybrid AI..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <>
            {/* Result Card */}
            <Card className={result.approved ? "border-green-500/50 bg-green-950/20" : "border-red-500/50 bg-red-950/20"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.approved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Application Approved
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Application Rejected
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Final Hybrid Score</span>
                    <span className="text-2xl font-bold">{result.finalScore}/100</span>
                  </div>
                  <Progress value={result.finalScore} className="h-3" />
                </div>

                <Alert>
                  <AlertDescription>{result.explanation}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Technique Breakdown</CardTitle>
                <CardDescription>How each technique contributed to the final decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.breakdown.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {item.technique.includes("AIML") && <Brain className="w-4 h-4 text-primary" />}
                        {item.technique.includes("Soft") && <Cpu className="w-4 h-4 text-accent" />}
                        {item.technique.includes("Crypto") && <Lock className="w-4 h-4 text-green-500" />}
                        <span className="font-medium">{item.technique}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{item.percentage}%</span>
                        <span className="text-xs text-muted-foreground ml-2">Score: {item.score}/100</span>
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default LoanApplicationPage;