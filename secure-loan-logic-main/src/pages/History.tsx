import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    const userObj = JSON.parse(currentUser);
    setUser(userObj);

    const allApps = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const userApps = allApps.filter((app: any) => app.userId === userObj.id);
    setApplications(userApps.reverse());
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mt-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Application History</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No applications yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {app.result.approved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {new Date(app.date).toLocaleDateString()}
                    </CardTitle>
                    <Badge variant={app.result.approved ? "default" : "destructive"}>
                      {app.result.approved ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Loan Amount:</span>
                      <p className="font-semibold">₹{app.formData.loanAmount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CIBIL Score:</span>
                      <p className="font-semibold">{app.formData.cibilScore}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Final Score:</span>
                      <p className="font-semibold">{app.result.finalScore}/100</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Income:</span>
                      <p className="font-semibold">₹{app.formData.income}/mo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;