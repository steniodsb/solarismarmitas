import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import logoSolaris from "@/assets/logo-solaris.webp";

export default function AdminLoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email ou senha inválidos.");
    } else {
      // Wait for auth state change to verify admin
      setTimeout(() => navigate("/admin"), 500);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <img src={logoSolaris} alt="Solaris" className="h-12 mx-auto" />
          <h1 className="font-display text-xl font-bold text-card-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground">Faça login para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button variant="cta" size="lg" type="submit" className="w-full" disabled={submitting}>
            <Lock className="h-4 w-4" />
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
